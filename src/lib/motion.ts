import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const EASE_OUT = 'power3.out';
export const DURATION = 0.9;
export const TRIGGER_START = 'top 88%';

const REVEAL_DIRS: Record<string, gsap.TweenVars> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: -48 },
  right: { x: 48 },
  scale: { scale: 0.94 },
  fade: {},
};

if (typeof window !== 'undefined') {
  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') {
    refresh();
  } else {
    window.addEventListener('load', refresh, { once: true });
  }
  document.fonts?.ready.then(refresh);
}

export interface MotionScopeContext {
  scope: HTMLElement;
  desktop: boolean;
  mobile: boolean;
}

export function useMotionScope<T extends HTMLElement = HTMLDivElement>(
  callback?: (ctx: MotionScopeContext) => void | (() => void),
  deps: unknown[] = []
) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const scopeEl = ref.current;
    if (!scopeEl) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 768px)',
      },
      (context) => {
        const { motion, desktop } = context.conditions as {
          motion: boolean;
          desktop: boolean;
        };
        if (!motion) return;

        setupDataReveal(scopeEl);
        setupDataRevealGroup(scopeEl);
        setupDataRevealLines(scopeEl);
        setupDataParallax(scopeEl);

        return callback?.({
          scope: scopeEl,
          desktop: Boolean(desktop),
          mobile: !desktop,
        });
      }
    );

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

function setupDataReveal(scope: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('[data-reveal]', scope).forEach((el) => {
    const dir = REVEAL_DIRS[el.dataset.reveal || 'up'] ?? REVEAL_DIRS.up;
    gsap.from(el, {
      ...dir,
      opacity: 0,
      duration: DURATION,
      delay: parseFloat(el.dataset.revealDelay || '0') || 0,
      ease: EASE_OUT,
      scrollTrigger: {
        trigger: el,
        start: TRIGGER_START,
        once: true,
      },
    });
  });
}

function setupDataRevealGroup(scope: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('[data-reveal-group]', scope).forEach((el) => {
    const children = gsap.utils.toArray<HTMLElement>(':scope > *', el);
    if (!children.length) return;
    gsap.from(children, {
      y: 32,
      opacity: 0,
      duration: DURATION,
      ease: EASE_OUT,
      stagger: parseFloat(el.dataset.revealGroup || '0.08') || 0.08,
      scrollTrigger: {
        trigger: el,
        start: TRIGGER_START,
        once: true,
      },
    });
  });
}

function setupDataRevealLines(scope: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('[data-reveal-lines]', scope).forEach((el) => {
    const lines = gsap.utils.toArray<HTMLElement>('.line', el);
    if (!lines.length) return;
    gsap.from(lines, {
      yPercent: 110,
      duration: 1.1,
      ease: EASE_OUT,
      stagger: 0.12,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true,
      },
    });
  });
}

function setupDataParallax(scope: HTMLElement) {
  gsap.utils.toArray<HTMLElement>('[data-parallax]', scope).forEach((el) => {
    const amount = parseFloat(el.dataset.parallax || '40') || 40;
    gsap.fromTo(
      el,
      { yPercent: -amount / 10 },
      {
        yPercent: amount / 10,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('[data-parallax-frame]') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}

export { gsap, ScrollTrigger };
