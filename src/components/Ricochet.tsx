import { useCallback, useEffect, useRef, useState } from 'react';

const CELL_EMPTY = 0;
const CELL_ALIVE = 1;
const CELL_HIT = 2;
const GLYPH_W = 5;
const GLYPH_H = 7;
const CHAR_GAP = 1;
const LINE_GAP = 3;
const REGROW_DELAY = 1.4;

const PIXEL_FONT: Record<string, string> = {
  A: '.###./#...#/#...#/#####/#...#/#...#/#...#',
  B: '####./#...#/#...#/####./#...#/#...#/####.',
  C: '.####/#..../#..../#..../#..../#..../.####',
  D: '####./#...#/#...#/#...#/#...#/#...#/####.',
  E: '#####/#..../#..../####./#..../#..../#####',
  F: '#####/#..../#..../####./#..../#..../#....',
  G: '.###./#...#/#..../#..##/#...#/#...#/.###.',
  H: '#...#/#...#/#...#/#####/#...#/#...#/#...#',
  I: '#####/..#../..#../..#../..#../..#../#####',
  J: '..###/...#./...#./...#./...#./#..#./.##..',
  K: '#...#/#..#./#.#../##.../#.#../#..#./#...#',
  L: '#..../#..../#..../#..../#..../#..../#####',
  M: '#...#/##.##/#.#.#/#...#/#...#/#...#/#...#',
  N: '#...#/##..#/#.#.#/#..##/#...#/#...#/#...#',
  O: '.###./#...#/#...#/#...#/#...#/#...#/.###.',
  P: '####./#...#/#...#/####./#..../#..../#....',
  Q: '.###./#...#/#...#/#...#/#.#.#/#..#./.##.#',
  R: '####./#...#/#...#/####./#.#../#..#./#...#',
  S: '.####/#..../#..../.###./....#/....#/####.',
  T: '#####/..#../..#../..#../..#../..#../..#..',
  U: '#...#/#...#/#...#/#...#/#...#/#...#/.###.',
  V: '#...#/#...#/#...#/#...#/#...#/.#.#./..#..',
  W: '#...#/#...#/#...#/#...#/#.#.#/##.##/#...#',
  X: '#...#/#...#/.#.#./..#../.#.#./#...#/#...#',
  Y: '#...#/#...#/.#.#./..#../..#../..#../..#..',
  Z: '#####/....#/...#./..#../.#.../#..../#####',
  '0': '.###./#...#/#..##/#.#.#/##..#/#...#/.###.',
  '1': '..#../.##../..#../..#../..#../..#../.###.',
  '2': '.###./#...#/....#/...#./..#../.#.../#####',
  '3': '#####/...#./..#../...#./....#/#...#/.###.',
  '4': '...#./..##./.#.#./#..#./#####/...#./...#.',
  '5': '#####/#..../####./....#/....#/#...#/.###.',
  '6': '..##./.#.../#..../####./#...#/#...#/.###.',
  '7': '#####/....#/...#./..#../.#.../.#.../.#...',
  '8': '.###./#...#/#...#/.###./#...#/#...#/.###.',
  '9': '.###./#...#/#...#/.####/....#/...#./.##..',
  '.': '...../...../...../...../...../.##../.##..',
  ',': '...../...../...../...../.##../.##../#....',
  '!': '..#../..#../..#../..#../..#../...../..#..',
  '?': '.###./#...#/....#/..##./..#../...../..#..',
  '-': '...../...../...../#####/...../...../.....',
  "'": '..#../..#../...../...../...../...../.....',
  '&': '.##../#..#./#..#./.##../#.#.#/#..#./.##.#',
  '/': '....#/....#/...#./..#../.#.../#..../#....',
  '+': '...../..#../..#../#####/..#../..#../.....',
  ':': '...../..#../..#../...../..#../..#../.....',
};

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function lineCellWidth(line: string): number {
  return Math.max(0, line.length * 6 - CHAR_GAP);
}

function measureTextBlock(lines: string[]): { w: number; h: number } {
  return {
    w: Math.max(1, ...lines.map(lineCellWidth)),
    h: lines.length * GLYPH_H + (lines.length - 1) * LINE_GAP,
  };
}

function rasterizeLinesToGrid(
  lines: string[],
  cols: number,
  rows: number,
  verticalRatio: number
): Uint8Array {
  const grid = new Uint8Array(cols * rows);
  const startRow = Math.max(0, Math.round(rows * verticalRatio - measureTextBlock(lines).h / 2));

  lines.forEach((line, lineIdx) => {
    const startCol = Math.round((cols - lineCellWidth(line)) / 2);
    const rowBase = startRow + lineIdx * 10;

    Array.from(line.toUpperCase()).forEach((ch, charIdx) => {
      const glyph = PIXEL_FONT[ch];
      if (!glyph) return;
      const colBase = startCol + charIdx * 6;
      glyph.split('/').forEach((rowStr, r) => {
        for (let c = 0; c < GLYPH_W; c++) {
          if (rowStr[c] !== '#') continue;
          const gx = colBase + c;
          const gy = rowBase + r;
          if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
            grid[gy * cols + gx] = CELL_ALIVE;
          }
        }
      });
    });
  });

  return grid;
}

interface GameState {
  width: number;
  height: number;
  cell: number;
  cols: number;
  rows: number;
  grid: Uint8Array;
  standing: number;
  ox: number;
  oy: number;
  gap: number;
  accent: string;
  layer: HTMLCanvasElement;
  layerCtx: CanvasRenderingContext2D;
  layerDirty: boolean;
  radius: number;
  paddle: { x: number; w: number; h: number; y: number };
  ball: { x: number; y: number; vx: number; vy: number };
  baseSpeed: number;
  serving: boolean;
  serveDelay: number;
  lives: number;
  phase: 'idle' | 'attract' | 'playing' | 'won' | 'over';
  clock: number;
  regrow: { cell: number; at: number }[];
  last: number;
  acc: number;
}

export interface RicochetProps {
  lines?: string[];
  caption?: string;
  startingLives?: number;
  autoPlay?: boolean;
  speed?: number;
  className?: string;
  panelClassName?: string;
  onWin?: () => void;
}

export default function Ricochet({
  lines = ['PIXEL', 'BY PIXEL'],
  caption,
  startingLives = 3,
  autoPlay = true,
  speed = 1,
  className = '',
  panelClassName = 'aspect-[16/10] sm:aspect-[2/1]',
  onWin,
}: RicochetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controlsRef = useRef<{
    launch: () => void;
    movePaddleTo: (x: number) => void;
    nudgePaddle: (dx: number) => void;
  } | null>(null);
  const stateRef = useRef<GameState | null>(null);

  const linesKey = lines.join('');
  const linesRef = useRef(lines);
  const onWinRef = useRef(onWin);

  useEffect(() => {
    linesRef.current = lines;
    onWinRef.current = onWin;
  }, [lines, onWin]);

  const [phase, setPhase] = useState<'idle' | 'attract' | 'playing' | 'won' | 'over'>('idle');
  const [lives, setLives] = useState(startingLives);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!container || !canvas || !ctx) return;

    let rafId = 0;
    let lastSizeKey = '';
    let docVisible = true;
    let inViewport = false;

    const redrawLayer = () => {
      const s = stateRef.current!;
      const { layerCtx, cell, gap, cols, rows, grid, ox, oy } = s;
      layerCtx.clearRect(0, 0, s.width, s.height);
      const brickSize = cell - gap;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const val = grid[r * cols + c];
          if (val !== CELL_EMPTY) {
            layerCtx.fillStyle = val === CELL_ALIVE ? '#f2efe9' : 'rgba(242,239,233,0.07)';
            layerCtx.fillRect(ox + c * cell, oy + r * cell, brickSize, brickSize);
          }
        }
      }
      s.layerDirty = false;
    };

    const draw = () => {
      const s = stateRef.current;
      if (!s) return;
      if (s.layerDirty) redrawLayer();
      ctx.clearRect(0, 0, s.width, s.height);
      ctx.drawImage(s.layer, 0, 0, s.width, s.height);
      if (s.phase !== 'playing' && s.phase !== 'attract') return;

      const { paddle, ball, radius } = s;
      ctx.fillStyle = s.accent;
      const px = paddle.x - paddle.w / 2;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(px, paddle.y, paddle.w, paddle.h, paddle.h / 2);
        ctx.fill();
      } else {
        ctx.fillRect(px, paddle.y, paddle.w, paddle.h);
      }
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const initBoard = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w < 40 || h < 40) return;
      lastSizeKey = `${w}x${h}`;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const shouldAttract = autoPlay && !prefersReducedMotion();
      const textLines = linesRef.current;
      const block = measureTextBlock(textLines);
      const idealPitch = Math.min(
        (w * (w < 520 ? 0.94 : 0.88)) / block.w,
        (h * 0.56) / block.h
      );
      const invDpr = 1 / dpr;
      const cell = clamp(Math.floor(idealPitch / invDpr) * invDpr, 4, 26);
      const cols = Math.floor(w / cell);
      const rows = Math.floor(h / cell);
      const grid = rasterizeLinesToGrid(
        textLines,
        cols,
        rows,
        clamp(0.3 + (h / w) * 0.12, 0.3, 0.44)
      );

      let standing = 0;
      for (let i = 0; i < grid.length; i++) {
        if (grid[i] === CELL_ALIVE) standing += 1;
      }

      const layer = document.createElement('canvas');
      layer.width = canvas.width;
      layer.height = canvas.height;
      const layerCtx = layer.getContext('2d')!;
      layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stateRef.current = {
        width: w,
        height: h,
        cell,
        cols,
        rows,
        grid,
        standing,
        ox: (w - cols * cell) / 2,
        oy: (h - rows * cell) / 2,
        gap: Math.max(1, Math.round(cell * 0.22)),
        accent:
          getComputedStyle(container).getPropertyValue('--accent').trim() || '#e8e4dc',
        layer,
        layerCtx,
        layerDirty: true,
        radius: clamp(cell * 0.5, 4, 9),
        paddle: {
          x: w / 2,
          w: clamp(w * 0.26, 64, 200),
          h: clamp(cell * 0.8, 5, 14),
          y: h - Math.max(26, cell * 2.4),
        },
        ball: { x: w / 2, y: 0, vx: 0, vy: 0 },
        baseSpeed: clamp(h * 0.46, 150, 420) * speed,
        serving: true,
        serveDelay: shouldAttract ? 0.6 : Infinity,
        lives: startingLives,
        phase: shouldAttract ? 'attract' : 'idle',
        clock: 0,
        regrow: [],
        last: 0,
        acc: 0,
      };

      setPhase(shouldAttract ? 'attract' : 'idle');
      setLives(startingLives);
      draw();
    };

    const getHitCells = () => {
      const { ball, radius, cell, cols, rows, ox, oy, grid } = stateRef.current!;
      const cMin = Math.floor((ball.x - radius - ox) / cell);
      const cMax = Math.floor((ball.x + radius - ox) / cell);
      const rMin = Math.floor((ball.y - radius - oy) / cell);
      const rMax = Math.floor((ball.y + radius - oy) / cell);
      const hits: number[] = [];

      for (let r = Math.max(0, rMin); r <= Math.min(rows - 1, rMax); r++) {
        for (let c = Math.max(0, cMin); c <= Math.min(cols - 1, cMax); c++) {
          if (grid[r * cols + c] === CELL_ALIVE) {
            hits.push(r * cols + c);
          }
        }
      }
      return hits;
    };

    const stepAxis = (axis: 'x' | 'y', dt: number) => {
      const s = stateRef.current!;
      const { ball } = s;
      if (axis === 'x') ball.x += ball.vx * dt;
      else ball.y += ball.vy * dt;

      const hits = getHitCells();
      if (!hits.length) return;
      const isAttract = s.phase === 'attract';
      hits.forEach((cellIdx) => {
        s.grid[cellIdx] = CELL_HIT;
        s.standing -= 1;
        if (isAttract) {
          s.regrow.push({ cell: cellIdx, at: s.clock + REGROW_DELAY });
        }
      });
      s.layerDirty = true;
      if (axis === 'x') {
        ball.x -= ball.vx * dt;
        ball.vx = -ball.vx;
      } else {
        ball.y -= ball.vy * dt;
        ball.vy = -ball.vy;
      }
    };

    const resetServe = () => {
      const s = stateRef.current!;
      s.serving = true;
      s.serveDelay = 0.8;
      s.ball.vx = 0;
      s.ball.vy = 0;
    };

    const transitionPhase = (next: GameState['phase']) => {
      stateRef.current!.phase = next;
      setPhase(next);
      if (next === 'won') onWinRef.current?.();
    };

    const tickPhysics = (dt: number) => {
      const s = stateRef.current!;
      const { ball, paddle, radius } = s;
      const isAttract = s.phase === 'attract';

      s.clock += dt;
      while (s.regrow.length && s.regrow[0].at <= s.clock) {
        const { cell } = s.regrow.shift()!;
        if (s.grid[cell] === CELL_HIT) {
          s.grid[cell] = CELL_ALIVE;
          s.standing += 1;
          s.layerDirty = true;
        }
      }

      if (isAttract && !s.serving) {
        paddle.x = clamp(
          paddle.x + (ball.x - paddle.x) * Math.min(1, dt * 7),
          paddle.w / 2,
          s.width - paddle.w / 2
        );
      }

      if (s.serving) {
        ball.x = paddle.x;
        ball.y = paddle.y - radius - 1;
        if (Number.isFinite(s.serveDelay)) {
          s.serveDelay -= dt;
          if (s.serveDelay <= 0) {
            s.serving = false;
            ball.vx = s.baseSpeed * 0.35 * (Math.random() < 0.5 ? -1 : 1);
            ball.vy = -s.baseSpeed;
          }
        }
        return;
      }

      stepAxis('x', dt);
      stepAxis('y', dt);

      if (ball.x - radius < 0) {
        ball.x = radius;
        ball.vx = Math.abs(ball.vx);
      }
      if (ball.x + radius > s.width) {
        ball.x = s.width - radius;
        ball.vx = -Math.abs(ball.vx);
      }
      if (ball.y - radius < 0) {
        ball.y = radius;
        ball.vy = Math.abs(ball.vy);
      }

      const withinPaddleX = Math.abs(ball.x - paddle.x) <= paddle.w / 2 + radius;
      const withinPaddleY =
        ball.vy > 0 && ball.y + radius >= paddle.y && ball.y - radius <= paddle.y + paddle.h;

      if (withinPaddleX && withinPaddleY) {
        const hitAngle = clamp((ball.x - paddle.x) / (paddle.w / 2), -1, 1) * 1.05;
        const speedMag = Math.min(Math.hypot(ball.vx, ball.vy) * 1.008, s.baseSpeed * 1.45);
        ball.vx = Math.sin(hitAngle) * speedMag;
        ball.vy = -Math.cos(hitAngle) * speedMag;
        ball.y = paddle.y - radius - 0.5;
      }

      if (ball.y - radius > s.height) {
        if (isAttract) {
          resetServe();
        } else {
          s.lives -= 1;
          setLives(s.lives);
          if (s.lives <= 0) transitionPhase('over');
          else resetServe();
        }
      }

      if (!isAttract && s.standing === 0) {
        transitionPhase('won');
      }
    };

    const STEP = 1 / 120;
    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      const s = stateRef.current;
      if (!s) return;
      const elapsed = s.last ? Math.min((now - s.last) / 1000, 4 * STEP) : 0;
      s.last = now;
      if (s.phase === 'playing' || s.phase === 'attract') {
        s.acc += elapsed;
        let steps = 0;
        while (s.acc >= STEP && steps < 4) {
          tickPhysics(STEP);
          s.acc -= STEP;
          steps += 1;
        }
        if (steps === 4) s.acc = 0;
      }
      draw();
    };

    const shouldRun = () => docVisible && inViewport;
    const startLoop = () => {
      if (!rafId && shouldRun()) {
        if (stateRef.current) {
          stateRef.current.last = 0;
          stateRef.current.acc = 0;
        }
        rafId = requestAnimationFrame(loop);
      }
    };
    const stopLoop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    controlsRef.current = {
      launch: () => {
        let s = stateRef.current;
        if (!s) return;
        if (s.phase !== 'playing') {
          initBoard();
          s = stateRef.current!;
        }
        s.phase = 'playing';
        setPhase('playing');
        if (s.serving) {
          s.ball.x = s.paddle.x;
          s.ball.y = s.paddle.y - s.radius - 1;
          s.serving = false;
          s.serveDelay = Infinity;
          s.ball.vx = s.baseSpeed * 0.35;
          s.ball.vy = -s.baseSpeed;
        }
        startLoop();
      },
      movePaddleTo: (x: number) => {
        const s = stateRef.current;
        if (s) {
          s.paddle.x = clamp(x, s.paddle.w / 2, s.width - s.paddle.w / 2);
        }
      },
      nudgePaddle: (dx: number) => {
        const s = stateRef.current;
        if (s) {
          s.paddle.x = clamp(s.paddle.x + dx, s.paddle.w / 2, s.width - s.paddle.w / 2);
        }
      },
    };

    initBoard();
    startLoop();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const r = container.getBoundingClientRect();
        if (`${Math.round(r.width)}x${Math.round(r.height)}` !== lastSizeKey) {
          initBoard();
        }
      }, 180);
    });
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        if (shouldRun()) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 }
    );
    io.observe(container);

    const onVisibility = () => {
      docVisible = document.visibilityState === 'visible';
      if (shouldRun()) startLoop();
      else stopLoop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stopLoop();
      clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      controlsRef.current = null;
    };
  }, [linesKey, startingLives, autoPlay, speed]);

  const engageIfAttract = useCallback(() => {
    if (stateRef.current?.phase === 'attract') {
      controlsRef.current?.launch();
      return true;
    }
    return false;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (container) {
        engageIfAttract();
        controlsRef.current?.movePaddleTo(e.clientX - container.getBoundingClientRect().left);
      }
    },
    [engageIfAttract]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const step = (stateRef.current?.cell ?? 8) * 4;
      if (e.key === 'ArrowLeft') {
        engageIfAttract();
        controlsRef.current?.nudgePaddle(-step);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        engageIfAttract();
        controlsRef.current?.nudgePaddle(step);
        e.preventDefault();
      } else if (e.key === ' ' || e.key === 'Enter') {
        controlsRef.current?.launch();
        e.preventDefault();
      }
    },
    [engageIfAttract]
  );

  const statusText =
    phase === 'won'
      ? 'Cleared'
      : phase === 'over'
        ? 'Out of balls'
        : phase === 'playing'
          ? 'Playing'
          : 'Ready';

  return (
    <div className={`relative ${className}`}>
      {caption && (
        <p className="mb-5 inline-block pb-1 border-b-2 border-[var(--accent)] text-xs sm:text-sm font-medium tracking-wide text-white/80">
          {caption}
        </p>
      )}

      <div
        ref={containerRef}
        role="application"
        aria-roledescription="brick breaker"
        aria-label={`${lines.join(' ')} — a playable headline. Arrow keys move the paddle, space launches the ball.`}
        tabIndex={0}
        onPointerMove={onPointerMove}
        onPointerDown={() => controlsRef.current?.launch()}
        onKeyDown={onKeyDown}
        style={{ touchAction: phase === 'playing' ? 'none' : 'auto' }}
        className={`relative w-full ${panelClassName} select-none outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${
          phase === 'playing' ? 'cursor-none' : 'cursor-pointer'
        }`}
      >
        <canvas ref={canvasRef} aria-hidden="true" className="block w-full h-full" />
        <h2 className="sr-only">{lines.join(' ')}</h2>
        <p aria-live="polite" className="sr-only">
          {statusText}
        </p>

        {phase === 'playing' && (
          <div className="absolute top-3 right-3 flex gap-1.5" aria-hidden="true">
            {Array.from({ length: startingLives }).map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx < lives ? 'bg-[var(--accent)]' : 'bg-white/15'
                }`}
              />
            ))}
          </div>
        )}

        {phase !== 'playing' && (
          <div className="absolute bottom-4 right-4 flex items-center gap-4 pointer-events-none">
            {(phase === 'over' || phase === 'won') && (
              <span
                className={`bg-[#050505] px-2 py-1 text-xs sm:text-sm tracking-widest uppercase ${
                  phase === 'won' ? 'text-[var(--accent)]' : 'text-white/50'
                }`}
              >
                {statusText}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                controlsRef.current?.launch();
              }}
              className="pointer-events-auto cursor-pointer px-5 py-2 bg-[#050505] border border-[var(--accent)]/50 text-[var(--accent)] text-xs sm:text-sm tracking-[0.3em] uppercase transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-contrast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {phase === 'over' || phase === 'won' ? 'Again' : 'Play'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
