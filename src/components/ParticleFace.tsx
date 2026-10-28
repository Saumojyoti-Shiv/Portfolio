import { RefObject, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { computeCellPitch, smoothstep } from '../lib/portfolioLogic';

const DUST_RATIO = 0.07;
const ATLAS_W = 1024;
const ATLAS_H = 640;
const WIN_PX = 56;

const VERTEX_SHADER = `#version 300 es
precision highp float;

in vec2 aHome;   // 0..1 inside the anchor rect
in vec3 aAir;    // x,y 0..1 over the canvas, z = depth (0 near, 1 far)
in vec4 aInfo;   // brightness, delay, duration, phase
in vec3 aCell;   // atlas window origin (uv), kind (0 tile, 1 dust)

uniform vec2 uRes;       // canvas, CSS px
uniform vec4 uRect;      // anchor x, y, w, h in canvas CSS px
uniform float uCell;     // tile pitch, CSS px
uniform float uDpr;
uniform float uTime;     // seconds, always running
uniform float uReveal;   // seconds since play
uniform float uScatter;  // 0 = face, 1 = blown back into the air
uniform vec2 uMouse;     // CSS px, far away when absent

out vec2 vCell;
out float vBright;
out float vLand;
out float vAlpha;
out float vPhase;

float inOut(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
  float bright = aInfo.x;
  float delay  = aInfo.y;
  float dur    = aInfo.z;
  float phase  = aInfo.w;
  float depth  = aAir.z;
  bool dust    = aCell.z > 0.5;

  // Air position: a slow float, nearer specks drift further.
  vec2 drift = vec2(sin(uTime * 0.31 + phase * 6.283), cos(uTime * 0.23 + phase * 9.1))
             * (6.0 + 22.0 * (1.0 - depth));
  vec2 air  = aAir.xy * uRes + drift;
  vec2 home = uRect.xy + aHome * uRect.zw;

  // Reveal: fade in as a speck (staggered), then fly home.
  float appear = smoothstep(0.0, 0.8, uReveal - delay * 0.35);
  float fly    = dust ? 0.0 : clamp((uReveal - delay) / dur, 0.0, 1.0);
  float e      = inOut(fly);

  // Scroll: tiles leave in a ragged order rather than all at once.
  float q = clamp(uScatter * 1.7 - phase * 0.7, 0.0, 1.0);
  q = q * q;
  float k = e * (1.0 - q);              // 1 = sitting in the face

  vec2 pos = mix(air, home, k);

  // A curved path reads as gathered, a straight one as tweened.
  vec2 d = home - air;
  pos += vec2(-d.y, d.x) * 0.18 * sin(3.14159 * k) * (phase - 0.5);

  // The pointer parts the tiles it passes over.
  vec2 m = pos - uMouse;
  float ml = length(m);
  pos += (ml > 0.001 ? m / ml : vec2(0.0)) * smoothstep(110.0, 0.0, ml) * 16.0 * k;

  float land  = smoothstep(0.55, 1.0, k);
  float speck = mix(2.2, 0.9, depth);
  float tile  = uCell * (0.25 + 0.7 * bright);
  float size  = mix(speck, tile, land);

  float dustA = dust ? mix(0.55, 0.22, smoothstep(2.0, 4.0, uReveal)) : 1.0;
  vAlpha  = appear * mix(0.25 + 0.55 * (1.0 - depth), 1.0, land) * dustA;
  vBright = bright;
  vLand   = land;
  vCell   = aCell.xy;
  vPhase  = phase;

  vec2 clip = pos / uRes * 2.0 - 1.0;
  gl_Position  = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = max(size * uDpr, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uAtlas;
uniform vec2 uWin;     // window size in atlas uv
uniform float uTime;

in vec2 vCell;
in float vBright;
in float vLand;
in float vAlpha;
in float vPhase;

out vec4 outColor;

void main() {
  vec3 c = texture(uAtlas, vCell + gl_PointCoord * uWin).rgb;
  float peak = max(max(c.r, c.g), max(c.b, 0.06));
  vec3 hue = c / peak;
  vec3 tile = mix(hue, min(c * 1.8, 1.0), 0.35);
  tile = mix(tile, vec3(1.0), 0.15);

  float twinkle = 0.9 + 0.1 * sin(uTime * 1.6 + vPhase * 47.0);
  tile *= (0.1 + 0.95 * vBright) * twinkle;

  vec3 speck = vec3(0.9, 0.92, 1.0);
  vec3 rgb = mix(speck, tile, vLand);
  outColor = vec4(rgb * vAlpha, vAlpha);
}
`;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile error');
  }
  return shader;
}

const THUMB_CROPS: [number, number, number, number][] = [
  [0.26, 0.17, 0.48, 0.37],
  [0.53, 0.08, 0.15, 0.55],
  [0.4, 0.14, 0.16, 0.72],
  [0.2, 0.22, 0.4, 0.4],
];

function buildAtlasCanvas(images: HTMLImageElement[]): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_W;
  canvas.height = ATLAS_H;
  const ctx = canvas.getContext('2d')!;
  const halfW = ATLAS_W / 2;
  const halfH = ATLAS_H / 2;

  if (images.length === 0) {
    ctx.fillStyle = '#d4d8e8';
    ctx.fillRect(0, 0, ATLAS_W, ATLAS_H);
    return canvas;
  }

  images.slice(0, 4).forEach((img, idx) => {
    const [cx, cy, cw, ch] = THUMB_CROPS[idx] ?? [0, 0, 1, 1];
    const nw = img.naturalWidth || 100;
    const nh = img.naturalHeight || 100;
    ctx.drawImage(
      img,
      cx * nw,
      cy * nh,
      cw * nw,
      ch * nh,
      (idx % 2) * halfW,
      Math.floor(idx / 2) * halfH,
      halfW,
      halfH
    );
  });

  return canvas;
}

/**
 * Flood-fill from image edges to detect solid studio white backgrounds (like in JPG portraits)
 * so the background becomes transparent and only the person's silhouette & features emit particles.
 */
function maskConnectedWhiteBackground(data: Uint8ClampedArray, w: number, h: number): Uint8Array {
  const mask = new Uint8Array(w * h);
  const isWhiteAt = (idx: number) => {
    const p = idx * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const a = data[p + 3];
    if (a < 128) return true;
    const minC = Math.min(r, g, b);
    const maxC = Math.max(r, g, b);
    return minC > 195 && maxC - minC < 38;
  };

  const corners = [0, w - 1, (h - 1) * w, h * w - 1];
  const whiteCorners = corners.filter((c) => isWhiteAt(c)).length;
  if (whiteCorners < 2) {
    return mask;
  }

  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const enqueueIfWhite = (x: number, y: number) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const idx = y * w + x;
    if (mask[idx] === 0 && isWhiteAt(idx)) {
      mask[idx] = 1;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < w; x++) {
    enqueueIfWhite(x, 0);
    enqueueIfWhite(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    enqueueIfWhite(0, y);
    enqueueIfWhite(w - 1, y);
  }

  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % w;
    const cy = (curr - cx) / w;
    enqueueIfWhite(cx - 1, cy);
    enqueueIfWhite(cx + 1, cy);
    enqueueIfWhite(cx, cy - 1);
    enqueueIfWhite(cx, cy + 1);
  }

  // Dilate background mask by 1 pixel so anti-aliased white studio halo around hair/ears is removed
  const dilated = new Uint8Array(mask);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      if (mask[idx] === 1) continue;
      if (
        mask[idx - 1] === 1 ||
        mask[idx + 1] === 1 ||
        mask[idx - w] === 1 ||
        mask[idx + w] === 1
      ) {
        dilated[idx] = 1;
      }
    }
  }

  return dilated;
}

interface SampledParticles {
  settle: number;
  cell: number;
  count: number;
  home: Float32Array;
  air: Float32Array;
  info: Float32Array;
  cellAttr: Float32Array;
}

function samplePortrait(
  img: HTMLImageElement,
  anchorWidth: number,
  visibleRatio: number
): SampledParticles {
  const cell = computeCellPitch(anchorWidth);
  const cols = Math.max(20, Math.round(anchorWidth / cell));
  const rows = Math.round((cols * img.naturalHeight) / img.naturalWidth);

  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, cols, rows);

  const imgData = ctx.getImageData(0, 0, cols, rows).data;
  const bgMask = maskConnectedWhiteBackground(imgData, cols, rows);

  const home: number[] = [];
  const air: number[] = [];
  const info: number[] = [];
  const cellAttr: number[] = [];

  const winU = WIN_PX / ATLAS_W;
  const winV = WIN_PX / ATLAS_H;
  let maxSettle = 0;

  const pushParticle = (hx: number, hy: number, bright: number, isDust: boolean) => {
    home.push(hx, hy);
    air.push(Math.random() * 1.2 - 0.1, Math.random() * 1.2 - 0.1, Math.random());
    const delay = 0.35 + Math.random() * 1.0 + hy * 0.45;
    const dur = 1.35 + Math.random() * 0.55;
    if (!isDust) {
      maxSettle = Math.max(maxSettle, delay + dur);
    }
    info.push(bright, delay, dur, Math.random());
    cellAttr.push(Math.random() * (1 - winU), Math.random() * (1 - winV), isDust ? 1 : 0);
  };

  const lumArray = new Float32Array(cols * rows);
  for (let i = 0; i < cols * rows; i++) {
    if (bgMask[i] === 1) {
      lumArray[i] = 0;
      continue;
    }
    const p = i * 4;
    const alpha = imgData[p + 3] / 255;
    if (alpha < 0.05) {
      lumArray[i] = 0;
      continue;
    }
    const rawLum = (0.2126 * imgData[p] + 0.7152 * imgData[p + 1] + 0.0722 * imgData[p + 2]) / 255;
    // Boost dark hair/suit edges slightly so the full portrait silhouette is crisp on #050505
    lumArray[i] = Math.max(0.06, rawLum) * alpha;
  }

  const validLums = Array.from(lumArray)
    .filter((v) => v >= 0.035)
    .sort((a, b) => a - b);
  const lowP = validLums[Math.floor(validLums.length * 0.02)] ?? 0;
  const highP = validLums[Math.floor(validLums.length * 0.97)] ?? 1;
  const maxRow = Math.min(rows, Math.ceil(rows * visibleRatio));

  for (let r = 0; r < maxRow; r++) {
    for (let c = 0; c < cols; c++) {
      const val = lumArray[r * cols + c];
      if (val < 0.035 || (val < 0.08 && Math.random() < 0.35)) continue;
      const norm = Math.min(1, Math.max(0, (val - lowP) / (highP - lowP || 1)));
      const bright = 0.22 * norm + 0.78 * smoothstep(0.08, 0.58, norm);
      pushParticle((c + 0.5) / cols, (r + 0.5) / rows, Math.max(0.18, bright), false);
    }
  }

  const tileCount = home.length / 2;
  const dustCount = Math.max(180, Math.round(tileCount * DUST_RATIO));
  for (let i = 0; i < dustCount; i++) {
    pushParticle(0.5, 0.5, 0.35, true);
  }

  return {
    settle: maxSettle,
    cell,
    count: home.length / 2,
    home: new Float32Array(home),
    air: new Float32Array(air),
    info: new Float32Array(info),
    cellAttr: new Float32Array(cellAttr),
  };
}

export interface ParticleFaceProps {
  src: string;
  thumbs: string[];
  anchorRef: RefObject<HTMLImageElement | null>;
  play: boolean;
  label: string;
  className?: string;
}

export default function ParticleFace({
  src,
  thumbs,
  anchorRef,
  play,
  label,
  className = '',
}: ParticleFaceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (play && playStartRef.current === null) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      playStartRef.current = performance.now() / 1000 - (reduced ? 100 : 0);
    }
  }, [play]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const anchor = anchorRef.current;
    if (!canvas || !anchor) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });

    const fallbackToImg = () => {
      anchor.style.visibility = 'visible';
      canvas.style.display = 'none';
    };

    if (!gl) {
      fallbackToImg();
      return;
    }

    let disposed = false;
    let tickerActive = false;
    let isIntersecting = true;
    let particleCount = 0;
    let cellPitch = 6;
    let settleTime = 0;

    const setStateAttr = (state: string) => {
      if (canvas.dataset.state !== state) {
        canvas.dataset.state = state;
      }
    };
    setStateAttr('idle');

    let lastSampledWidth = -1;
    let loadedPortrait: HTMLImageElement | null = null;
    const mountTime = performance.now() / 1000;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
      gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? 'link error');
      }
    } catch (err) {
      console.error(err);
      fallbackToImg();
      return;
    }

    gl.useProgram(program);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uniforms = {
      res: u('uRes'),
      rect: u('uRect'),
      cell: u('uCell'),
      dpr: u('uDpr'),
      time: u('uTime'),
      reveal: u('uReveal'),
      scatter: u('uScatter'),
      mouse: u('uMouse'),
      atlas: u('uAtlas'),
      win: u('uWin'),
    };

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const attribSpecs: [string, number][] = [
      ['aHome', 2],
      ['aAir', 3],
      ['aInfo', 4],
      ['aCell', 3],
    ];
    const buffers = attribSpecs.map(([name, size]) => {
      const buf = gl.createBuffer()!;
      const loc = gl.getAttribLocation(program, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      return buf;
    });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(uniforms.win, WIN_PX / ATLAS_W, WIN_PX / ATLAS_H);

    const rebuildBuffersIfNeeded = () => {
      const rect = anchor.getBoundingClientRect();
      const w = rect.width;
      if (!loadedPortrait || w < 10 || Math.abs(w - lastSampledWidth) < 1) return;
      lastSampledWidth = w;
      const cRect = canvas.getBoundingClientRect();
      const visRatio = Math.max(0, Math.min(1, (cRect.bottom - rect.top) / (rect.height || 1)));
      const sampled = samplePortrait(loadedPortrait, w, visRatio || 1);
      particleCount = sampled.count;
      cellPitch = sampled.cell;
      settleTime = sampled.settle;
      const arrays = [sampled.home, sampled.air, sampled.info, sampled.cellAttr];
      arrays.forEach((arr, idx) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers[idx]);
        gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
      });
    };

    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const onPointerMove = (e: PointerEvent | MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
      if (pointer.x < -999) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
    };
    const onPointerLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const renderFrame = () => {
      if (!particleCount || playStartRef.current === null) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cRect = canvas.getBoundingClientRect();
      const cw = Math.round(cRect.width * dpr);
      const ch = Math.round(cRect.height * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      rebuildBuffersIfNeeded();

      const aRect = anchor.getBoundingClientRect();
      const now = performance.now() / 1000;
      const scatterVal = reducedMotion
        ? 0
        : Math.min(1, Math.max(0, -cRect.top / (cRect.height * 0.7 || 1)));

      pointer.x += (pointer.tx - pointer.x) * 0.18;
      pointer.y += (pointer.ty - pointer.y) * 0.18;

      gl.viewport(0, 0, cw, ch);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(uniforms.res, cRect.width, cRect.height);
      gl.uniform4f(
        uniforms.rect,
        aRect.left - cRect.left,
        aRect.top - cRect.top,
        aRect.width,
        aRect.height
      );
      gl.uniform1f(uniforms.cell, cellPitch);
      gl.uniform1f(uniforms.dpr, dpr);
      gl.uniform1f(uniforms.time, now - mountTime);

      const revealElapsed = now - playStartRef.current;
      gl.uniform1f(uniforms.reveal, revealElapsed);
      gl.uniform1f(uniforms.scatter, scatterVal);

      setStateAttr(
        scatterVal >= 1
          ? 'gone'
          : scatterVal > 0
            ? 'scattering'
            : revealElapsed < settleTime
              ? 'gathering'
              : 'formed'
      );

      gl.uniform2f(uniforms.mouse, pointer.x, pointer.y);
      gl.drawArrays(gl.POINTS, 0, particleCount);
    };

    const setTickerRunning = (shouldRun: boolean) => {
      if (shouldRun !== tickerActive) {
        tickerActive = shouldRun;
        if (shouldRun) {
          gsap.ticker.add(renderFrame);
        } else {
          gsap.ticker.remove(renderFrame);
        }
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      setTickerRunning(isIntersecting && particleCount > 0);
    });
    io.observe(canvas);

    Promise.all([
      loadImage(src),
      Promise.all(thumbs.map((t) => loadImage(t).catch(() => null))),
    ])
      .then(([portraitImg, loadedThumbs]) => {
        if (disposed) return;
        loadedPortrait = portraitImg;
        const validThumbs = loadedThumbs.filter((img): img is HTMLImageElement => img !== null);
        const tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          buildAtlasCanvas(validThumbs.length ? validThumbs : [portraitImg])
        );
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(uniforms.atlas, 0);
        rebuildBuffersIfNeeded();
        setTickerRunning(isIntersecting && particleCount > 0);
      })
      .catch((err) => {
        console.error(err);
        fallbackToImg();
      });

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    return () => {
      disposed = true;
      setTickerRunning(false);
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      buffers.forEach((b) => gl.deleteBuffer(b));
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, [src, thumbs, anchorRef]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="particle-face-canvas"
      role="img"
      aria-label={label}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
