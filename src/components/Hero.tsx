import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { site } from '../config/site';
import { morphWordStep } from '../lib/portfolioLogic';
import Ballista from './Ballista';
import ParticleFace from './ParticleFace';

const HERO_PORTRAIT_SRC = '/assets/aistudio/profile_picture_16b7f9e2.jpg';
const PROJECT_THUMBS = [
  '/assets/aistudio/1_Autonomous_UAV_Navigation_4460a83b.jpg',
  '/assets/aistudio/2_NotifyGrid_7e8f4336.jpg',
  '/assets/aistudio/3_Vision-Language-Action__VLA__Robotic_Arm_cc4005a3.jpeg',
  '/assets/aistudio/4_AI_Knowledge_Assistant_ca877ed9.png',
];

const METALLIC_GRADIENT_CLASS =
  'text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800';

export interface HeroProps {
  onPreloadComplete?: () => void;
}

export default function Hero({ onPreloadComplete }: HeroProps) {
  const isAutostart = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('autostart') === '1';
  }, []);

  const [displayWord, setDisplayWord] = useState(
    isAutostart ? 'PORTFOLIO' : site.wordmark
  );
  const [ballistaDone, setBallistaDone] = useState(isAutostart);
  const [showBallista, setShowBallista] = useState(!isAutostart);
  const [playParticles, setPlayParticles] = useState(isAutostart);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const leftHalfRef = useRef<HTMLSpanElement | null>(null);
  const rightHalfRef = useRef<HTMLSpanElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const anchorImgRef = useRef<HTMLImageElement | null>(null);
  const onPreloadCompleteRef = useRef(onPreloadComplete);

  useEffect(() => {
    onPreloadCompleteRef.current = onPreloadComplete;
  }, [onPreloadComplete]);

  const portraitLoadedPromise = useMemo(
    () =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.src = HERO_PORTRAIT_SRC;
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      }),
    []
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAutostart) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAutostart]);

  useEffect(() => {
    const getTargetTop = (mobile: boolean) => {
      const vh = window.innerHeight;
      const headingHeight = wrapperRef.current?.offsetHeight || (mobile ? 80 : 200);
      const bottomReserve = mobile ? 96 : 84;
      const maxCenterY = vh - headingHeight / 2 - bottomReserve;
      const desiredRatio = mobile ? 0.72 : 0.73;
      const targetY = Math.min(vh * desiredRatio, maxCenterY);
      const pct = Math.max(55, Math.min(desiredRatio * 100, (targetY / vh) * 100));
      return `${pct.toFixed(1)}%`;
    };

    if (isAutostart) {
      const mobile = window.innerWidth < 768;
      const splitOffset = mobile ? window.innerWidth * 0.16 : Math.min(240, window.innerWidth * 0.16);
      if (wrapperRef.current) {
        gsap.set(wrapperRef.current, { top: getTargetTop(mobile) });
      }
      if (leftHalfRef.current) {
        gsap.set(leftHalfRef.current, { x: -splitOffset / 2 });
      }
      if (rightHalfRef.current) {
        gsap.set(rightHalfRef.current, { x: splitOffset / 2 });
      }
      if (subtitleRef.current && ctaRef.current) {
        gsap.set([subtitleRef.current, ctaRef.current], { y: 0, opacity: 1 });
      }
      document.body.style.overflow = 'auto';
      onPreloadCompleteRef.current?.();
      return;
    }

    if (!ballistaDone) return;

    const targetWord = 'PORTFOLIO';
    const sourceWord = site.wordmark;
    let step = 0;
    let intervalId: ReturnType<typeof setInterval>;
    let active = true;
    let ctx: gsap.Context | undefined;

    const handleResize = () => {
      if (!wrapperRef.current) return;
      const mobile = window.innerWidth < 768;
      gsap.set(wrapperRef.current, { top: getTargetTop(mobile) });
    };

    portraitLoadedPromise.then(() => {
      if (!active) return;

      intervalId = setInterval(() => {
        setDisplayWord(() => morphWordStep(sourceWord, targetWord, step));

        if (step >= targetWord.length) {
          clearInterval(intervalId);
          ctx = gsap.context(() => {
            const tl = gsap.timeline({
              onComplete: () => {
                document.body.style.overflow = 'auto';
                onPreloadCompleteRef.current?.();
                window.addEventListener('resize', handleResize);
              },
            });
            const mobile = window.innerWidth < 768;
            tl.to(
              wrapperRef.current,
              {
                top: getTargetTop(mobile),
                duration: 1.5,
                ease: 'power3.inOut',
              },
              '+=0.2'
            );
            tl.fromTo(
              [subtitleRef.current, ctaRef.current],
              { y: 50, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.2,
                ease: 'power3.out',
              },
              '-=1.0'
            );
            tl.call(() => setPlayParticles(true), undefined, '-=1.2');

            const splitOffset = mobile
              ? window.innerWidth * 0.16
              : Math.min(240, window.innerWidth * 0.16);

            tl.to(
              leftHalfRef.current,
              {
                x: -splitOffset / 2,
                duration: 1.5,
                ease: 'power3.out',
              },
              '<'
            );
            tl.to(
              rightHalfRef.current,
              {
                x: splitOffset / 2,
                duration: 1.5,
                ease: 'power3.out',
              },
              '<'
            );
          });
        }
        step += 1 / 3;
      }, 50);
    });

    return () => {
      active = false;
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
      ctx?.revert();
    };
  }, [ballistaDone, portraitLoadedPromise, isAutostart]);

  // Responsive typography: SAUMOJYOTI (10 chars) and PORTFOLIO (9 chars) fit cleanly on 1440px & mobile
  const heroTitleSizeClass =
    'flex items-baseline text-[13vw] sm:text-[13.5vw] md:text-[8.5rem] lg:text-[11.5rem] xl:text-[13.5rem] font-black tracking-tighter drop-shadow-2xl leading-none uppercase';

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-end justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        background: 'radial-gradient(circle, #222222 0%, #000000 80%)',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div
        ref={wrapperRef}
        className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none select-none flex flex-col items-start w-max"
      >
        <h1
          ref={headingRef}
          className={`${heroTitleSizeClass} ${METALLIC_GRADIENT_CLASS} transition-opacity duration-300 ${
            ballistaDone ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span ref={leftHalfRef} className="inline-block">
            {displayWord.slice(0, 4)}
          </span>
          <span ref={rightHalfRef} className="inline-block">
            {displayWord.slice(4)}
          </span>
        </h1>

        {showBallista && (
          <div
            className={`absolute top-0 left-0 transition-opacity duration-300 ${
              ballistaDone ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Ballista
              word={site.wordmark}
              className={heroTitleSizeClass}
              letterClassName={METALLIC_GRADIENT_CLASS}
              dotClassName="bg-gray-200"
              speed={1.15}
              onComplete={() => {
                setBallistaDone(true);
                setTimeout(() => setShowBallista(false), 320);
              }}
            />
          </div>
        )}

        <p
          ref={subtitleRef}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:-bottom-12 md:left-8 text-white text-base md:text-2xl lg:text-4xl leading-normal pb-1 drop-shadow-md z-10 opacity-0 w-max"
        >
          <span className="font-bold">{site.role.bold}</span>{' '}
          <span className="font-light italic text-gray-300">{site.role.light}</span>
        </p>

        <div
          ref={ctaRef}
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 md:translate-x-0 md:-bottom-11 md:left-auto md:right-20 flex items-center gap-2 md:gap-4 pointer-events-auto z-10 opacity-0 w-max"
        >
          <a
            href="#contact"
            aria-label="Scroll to Contact section"
            className="group w-8 h-8 md:w-12 md:h-12 rounded-full border border-gray-400/30 flex items-center justify-center backdrop-blur-md bg-black/20 hover:bg-white/10 hover:border-gray-400/50 transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            <svg
              className="w-3 h-3 md:w-4 md:h-4 text-gray-300 transition-transform duration-300 group-hover:rotate-45"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 7L7 17M7 17H16M7 17V8"
              />
            </svg>
          </a>
          <a
            href="#contact"
            className="px-4 py-1.5 md:px-6 md:py-2.5 rounded-full border border-gray-400/30 flex items-center justify-center backdrop-blur-md bg-black/20 hover:bg-white/10 hover:border-gray-400/50 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className="text-gray-300 text-xs md:text-base italic font-light tracking-wider">
              Contact
            </span>
          </a>
        </div>
      </div>

      {/* Portrait anchor sized and positioned so the entire face & chin sit clearly above PORTFOLIO, which rests across the neck/chest */}
      <div className="absolute inset-x-0 top-[10vh] md:top-[5vh] z-10 text-center text-white flex flex-col items-center w-full pointer-events-none">
        <img
          ref={anchorImgRef}
          src={HERO_PORTRAIT_SRC}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="invisible w-auto max-w-none h-[68vh] md:h-[82vh]"
        />
      </div>

      <ParticleFace
        src={HERO_PORTRAIT_SRC}
        thumbs={PROJECT_THUMBS}
        anchorRef={anchorImgRef}
        play={playParticles}
        label={`Interactive particle portrait of ${site.name}`}
        className="z-10"
      />
    </section>
  );
}
