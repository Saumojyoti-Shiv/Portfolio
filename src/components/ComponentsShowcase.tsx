import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CERTIFICATIONS_LINKEDIN_URL,
  showcaseComponents,
  ShowcaseComponentItem,
} from '../config/components';
import { gsap, ScrollTrigger, useMotionScope } from '../lib/motion';

const RACK_SCALES = [
  'scale-100 opacity-100',
  'scale-90 opacity-50',
  'scale-[0.81] opacity-25',
];

interface ComponentCardProps {
  item: ShowcaseComponentItem;
  isActive: boolean;
  rack: number;
  scrollDriven: boolean;
  wasDragged: () => boolean;
  onSelect: () => void;
}

function ComponentCard({
  item,
  isActive,
  rack,
  scrollDriven,
  wasDragged,
  onSelect,
}: ComponentCardProps) {
  const [imgError, setImgError] = useState(false);
  const isClickable = Boolean(item.credentialUrl);

  const cardInner = (
    <>
      <div
        className={`relative w-full aspect-[16/11] bg-[#0a0a0c] overflow-hidden p-2.5 sm:p-3 flex items-center justify-center ${
          scrollDriven ? 'max-h-[calc(100svh-300px)]' : ''
        }`}
      >
        {!imgError ? (
          <img
            src={item.sampleImage}
            alt={`${item.name} — ${item.issuer}`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-zinc-900 to-black">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
              {item.issuer}
            </span>
            <span className="text-xl font-black text-white">{item.name}</span>
            <span className="text-xs text-gray-400 mt-1">{item.issued}</span>
          </div>
        )}
      </div>

      <div className="px-4 py-3.5 border-t border-white/10 bg-[#0d0d0f]">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-sm md:text-base font-bold text-white leading-snug line-clamp-2 min-h-[2.5rem]">
            {item.name}
          </h3>
          <span className="px-2 py-0.5 rounded-sm bg-white/[0.07] border border-white/10 text-[10px] text-[var(--accent)] font-mono uppercase tracking-wider shrink-0">
            {item.issuer}
          </span>
        </div>

        <p className="text-gray-400 text-xs mb-2.5 font-light">{item.issued}</p>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 min-w-0 text-[10px] tracking-[0.1em] text-gray-400 font-mono uppercase tabular-nums truncate">
            {item.credentialId ? (
              <span className="truncate">ID: {item.credentialId}</span>
            ) : (
              <span className="truncate">Verified Certificate</span>
            )}
          </div>

          {isClickable ? (
            <span
              className={`flex items-center gap-1 text-[10px] tracking-[0.12em] font-mono uppercase whitespace-nowrap shrink-0 transition-colors ${
                isActive ? 'text-[var(--accent)]' : 'text-gray-500'
              }`}
            >
              Verify
              <svg
                className="w-2.5 h-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </span>
          ) : (
            <span className="text-[10px] tracking-[0.12em] font-mono uppercase whitespace-nowrap shrink-0 text-gray-500">
              Skill Badge
            </span>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div
      className={`relative shrink-0 snap-start flex flex-col origin-top-left transition-[scale,opacity] duration-[320ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
        scrollDriven
          ? 'w-[min(420px,max(310px,calc((100svh-240px)*0.88)))]'
          : 'w-[300px] sm:w-[360px] lg:w-[400px]'
      } ${RACK_SCALES[rack] ?? RACK_SCALES[2]}`}
    >
      {isClickable ? (
        <a
          href={item.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (wasDragged()) {
              e.preventDefault();
              return;
            }
            if (!isActive) {
              e.preventDefault();
              onSelect();
            }
          }}
          aria-label={
            isActive
              ? `Verify ${item.name} credential`
              : `Bring ${item.name} to the front`
          }
          aria-current={isActive ? 'true' : undefined}
          className="group block w-full text-left cursor-pointer bg-[#0d0d0f] border-2 border-[var(--accent)]/55 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
        >
          {cardInner}
        </a>
      ) : (
        <div
          role={!isActive ? 'button' : undefined}
          tabIndex={!isActive ? 0 : undefined}
          onClick={() => {
            if (wasDragged()) return;
            if (!isActive) {
              onSelect();
            }
          }}
          onKeyDown={(e) => {
            if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onSelect();
            }
          }}
          aria-label={!isActive ? `Bring ${item.name} to the front` : item.name}
          aria-current={isActive ? 'true' : undefined}
          className={`w-full text-left bg-[#0d0d0f] border-2 border-[var(--accent)]/55 overflow-hidden ${
            isActive ? 'cursor-default' : 'cursor-pointer'
          }`}
        >
          {cardInner}
        </div>
      )}
    </div>
  );
}

interface CatalogueEndCardProps {
  rack: number;
  scrollDriven: boolean;
}

function CatalogueEndCard({ rack, scrollDriven }: CatalogueEndCardProps) {
  return (
    <div
      className={`relative shrink-0 snap-start flex flex-col origin-top-left transition-[scale,opacity] duration-[320ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
        scrollDriven
          ? 'w-[min(420px,max(310px,calc((100svh-240px)*0.88)))]'
          : 'w-[300px] sm:w-[360px] lg:w-[400px]'
      } ${RACK_SCALES[rack] ?? RACK_SCALES[2]}`}
    >
      <a
        href={CERTIFICATIONS_LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-full border-2 border-[var(--accent)]/55 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
      >
        <div
          className={`relative w-full aspect-[16/11] overflow-hidden bg-[linear-gradient(160deg,#e8e4dc_0%,#cfc7b6_38%,#7b6f8f_72%,#2b2440_100%)] ${
            scrollDriven ? 'max-h-[calc(100svh-300px)]' : ''
          }`}
        >
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'linear-gradient(#050505 1px, transparent 1px), linear-gradient(90deg, #050505 1px, transparent 1px)',
              backgroundSize: '34px 34px',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-6 text-black">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-70">
              Complete credential archive
            </span>
            <div>
              <p className="text-5xl sm:text-6xl leading-[0.88] font-black tracking-tighter">
                All
              </p>
              <p className="text-base sm:text-lg font-bold tracking-tight mt-1.5">
                certifications & badges
              </p>
              <p className="text-xs sm:text-sm font-light mt-2 opacity-80 leading-snug">
                Explore the full list of verified licenses, courses, and technical badges on LinkedIn.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase">
              More Certifications
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="px-4 py-3.5 border-t border-white/10 bg-[#0d0d0f]">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="text-sm md:text-base font-bold text-white leading-snug line-clamp-2 min-h-[2.5rem]">
              Full Certifications Directory
            </h3>
            <span className="px-2 py-0.5 rounded-sm bg-white/[0.07] border border-white/10 text-[10px] text-[var(--accent)] font-mono uppercase tracking-wider shrink-0">
              LinkedIn
            </span>
          </div>
          <p className="text-gray-400 text-xs mb-2.5 font-light">
            IBM · Google Cloud · Kaggle · Hack2Skill
          </p>
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 text-[10px] tracking-[0.12em] text-gray-400 font-mono uppercase">
            <span>Verified Credentials</span>
            <span className="text-[var(--accent)]">View All ↗</span>
          </div>
        </div>
      </a>
    </div>
  );
}

export default function ComponentsShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useMotionScope<HTMLDivElement>();

  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );
  const [scrollProgress, setScrollProgress] = useState(0);

  const count = showcaseComponents.length;
  const clampedIdx = Math.min(activeIndex, count - 1);
  const scrollDriven = isLargeScreen && !reducedMotion;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsLargeScreen(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const updateActiveFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;
    const firstEl = track.children[0] as HTMLElement;
    const baseOffset = firstEl.offsetLeft;
    const sl = track.scrollLeft;
    let closestIdx = 0;
    let bestDist = Infinity;

    const maxCardChildren = Math.min(track.children.length, count + 1);
    for (let idx = 0; idx < maxCardChildren; idx++) {
      const el = track.children[idx] as HTMLElement;
      const cardLeft = el.offsetLeft - baseOffset;
      const dist = Math.abs(cardLeft - sl);
      if (dist < bestDist) {
        bestDist = dist;
        closestIdx = idx;
      }
    }
    setActiveIndex(closestIdx);
  }, [count]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveFromScroll);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    updateActiveFromScroll();
    return () => {
      cancelAnimationFrame(rafId);
      track.removeEventListener('scroll', onScroll);
    };
  }, [updateActiveFromScroll]);

  useEffect(() => {
    if (!scrollDriven) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const getScrollDist = () => {
      const firstEl = track.children[0] as HTMLElement | undefined;
      const targetEl = track.children[count - 1] as HTMLElement | undefined;
      if (firstEl && targetEl) {
        return Math.max(0, targetEl.offsetLeft - firstEl.offsetLeft);
      }
      return Math.max(0, track.scrollWidth - track.clientWidth);
    };

    const getVerticalPinLength = () => Math.max(1500, Math.round(getScrollDist() * 1.25));

    if (getScrollDist() <= 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${getVerticalPinLength()}`,
        pin: true,
        scrub: 0.4,
        onUpdate: (self) => setScrollProgress(self.progress),
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(
      track,
      { scrollLeft: 0 },
      { scrollLeft: getScrollDist, duration: 0.82, ease: 'none' }
    ).to(track, { scrollLeft: getScrollDist, duration: 0.18, ease: 'none' });

    const refresh = () => ScrollTrigger.refresh();
    const timer1 = setTimeout(refresh, 150);
    const timer2 = setTimeout(refresh, 600);
    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);

    const ro = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    ro.observe(document.body);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      ro.disconnect();
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(track, { clearProps: 'scrollLeft' });
    };
  }, [scrollDriven, count]);

  const scrollToIndex = useCallback(
    (idx: number) => {
      const track = trackRef.current;
      if (!track || track.children.length === 0) return;
      const firstEl = track.children[0] as HTMLElement;
      const target = track.children[
        Math.max(0, Math.min(count, idx))
      ] as HTMLElement | undefined;
      if (target) {
        track.scrollTo({
          left: target.offsetLeft - firstEl.offsetLeft,
          behavior: reducedMotion ? 'auto' : 'smooth',
        });
      }
    },
    [reducedMotion, count]
  );

  const dragState = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const track = trackRef.current;
    if (!track) return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startScroll: track.scrollLeft,
      moved: 0,
    };
    track.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || !trackRef.current) return;
    const dx = e.clientX - dragState.current.startX;
    dragState.current.moved = Math.abs(dx);
    trackRef.current.scrollLeft = dragState.current.startScroll - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragState.current.active) {
      dragState.current.active = false;
      trackRef.current?.releasePointerCapture?.(e.pointerId);
      scrollToIndex(activeIndex);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className={`bg-[#050505] w-full text-white overflow-hidden ${
        scrollDriven
          ? 'h-screen flex flex-col justify-center pt-16 pb-3'
          : 'pt-16 md:pt-24 pb-24'
      }`}
    >
      <span id="components" className="sr-only" aria-hidden="true" />
      <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-5 px-6 md:px-16">
        <div
          ref={leftColRef}
          className="w-full lg:w-[300px] xl:w-[340px] shrink-0 flex flex-col"
        >
          <div className="bg-white/[0.05] p-[1.125rem] border-t-2 border-white/80">
            <span className="inline-block text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--accent)] mb-2.5">
              Certifications & Badges
            </span>
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tighter text-white leading-[0.98] mb-5">
              Verified Credentials
            </h2>

            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
              Industry-recognized certifications and skill badges across Machine Learning,
              Generative AI, Multimodal RAG, and Google Cloud Vertex AI.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-3 bg-white/[0.05] p-[1.125rem]">
            <a
              href={CERTIFICATIONS_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-6 py-3.5 bg-[var(--accent)] text-black text-xs font-bold tracking-[0.15em] uppercase hover:bg-[var(--accent-hover)] transition-colors inline-flex items-center gap-2 shadow-[0_0_28px_-6px_var(--accent)] whitespace-nowrap shrink-0"
            >
              More Certifications
              <svg
                className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col bg-white/[0.05] p-[1.125rem] gap-3">
          <div
            ref={trackRef}
            role="group"
            aria-roledescription="carousel"
            aria-label="Certifications and skill badges"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={scrollDriven ? undefined : onPointerDown}
            onPointerMove={scrollDriven ? undefined : onPointerMove}
            onPointerUp={scrollDriven ? undefined : onPointerUp}
            onPointerCancel={scrollDriven ? undefined : onPointerUp}
            className={`relative flex items-stretch gap-3 pt-4 pb-2 -mt-2 -mr-[1.125rem] pr-[1.125rem] ${
              scrollDriven
                ? 'overflow-x-hidden'
                : 'overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing'
            } [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30`}
          >
            {showcaseComponents.map((item, idx) => (
              <ComponentCard
                key={item.slug}
                item={item}
                isActive={idx === activeIndex}
                rack={Math.min(2, Math.abs(idx - activeIndex))}
                scrollDriven={scrollDriven}
                wasDragged={() => dragState.current.moved > 6}
                onSelect={() => scrollToIndex(idx)}
              />
            ))}
            <CatalogueEndCard
              rack={Math.min(2, Math.abs(count - activeIndex))}
              scrollDriven={scrollDriven}
            />
            {scrollDriven && (
              <div aria-hidden="true" className="shrink-0 w-[35vw]" />
            )}
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="flex gap-[0.3rem]">
                {showcaseComponents.map((item, idx) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => scrollToIndex(idx)}
                    aria-label={`Go to ${item.name}`}
                    className={`h-[3px] transition-all duration-[320ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                      idx === clampedIdx ? 'w-5 bg-white' : 'w-2 bg-white/25 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <span className="hidden sm:inline text-[10px] tracking-[0.2em] text-[#ff5c3d] font-mono uppercase">
                {scrollDriven ? '↓ Scroll to spin the shelf' : '→ Drag to spin the shelf'}
              </span>
            </div>

            <span className="text-[10px] tracking-[0.2em] text-gray-500 font-mono tabular-nums">
              {clampedIdx + 1} / {count}
            </span>
          </div>
        </div>
      </div>

      {scrollDriven && (
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-16 mt-3 flex items-center gap-4">
          <span className="text-[10px] tracking-[0.2em] text-gray-500 font-mono uppercase whitespace-nowrap">
            Scroll = shelf
          </span>
          <div className="flex-1 h-px bg-white/10 relative">
            <div
              className="absolute inset-y-0 left-0 bg-[var(--accent)]"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-[10px] tracking-[0.2em] text-gray-500 font-mono tabular-nums whitespace-nowrap">
            P {scrollProgress.toFixed(2)}
          </span>
        </div>
      )}
    </section>
  );
}
