import { Fragment, useRef } from 'react';
import { DURATION, EASE_OUT, gsap, useMotionScope } from '../lib/motion';

interface StackRow {
  label: string;
  items: string[];
  copies: number;
  duration: number;
  reverse?: boolean;
}

const STACK_ROWS: StackRow[] = [
  {
    label: 'Languages',
    items: ['C++', 'Python', 'Java', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
    copies: 3,
    duration: 44,
  },
  {
    label: 'Domains',
    items: [
      'AI & ML',
      'Robotics & Automation',
      'Computer Vision',
      'Embedded Systems',
      'IoT',
      'Enterprise Backend Engineering',
      'DSA',
    ],
    copies: 3,
    duration: 52,
    reverse: true,
  },
  {
    label: 'Simulation & Robotics',
    items: [
      'Ubuntu 24.04 LTS',
      'Jazzy',
      'Gazebo Sim',
      'Gymnasium',
      'Soft Actor-Critic (SAC)',
      'G-Test',
      'ROS Test Framework',
      'Nvidia Omniverse',
    ],
    copies: 2,
    duration: 56,
  },
  {
    label: 'Frameworks & Libraries',
    items: [
      'PyTorch',
      'TensorFlow',
      'OpenCV',
      'Mediapipe',
      'Spring Boot 4',
      'Spring Cloud',
      'Next.js 15',
      'React 18/19',
      'Tailwind CSS',
      'Stable Baselines3',
      'ROS 2',
    ],
    copies: 2,
    duration: 58,
    reverse: true,
  },
  {
    label: 'Infrastructure & Backend',
    items: ['PostgreSQL', 'RabbitMQ', 'API Gateway', 'Eureka Service Discovery'],
    copies: 4,
    duration: 46,
  },
];

function MarqueeRow({ items, copies, duration, reverse }: Omit<StackRow, 'label'>) {
  const repeated = Array.from({ length: copies }, () => items).flat();
  return (
    <div className="marquee-row" aria-hidden="true">
      <div
        className="marquee-track"
        style={
          {
            '--marquee-duration': `${duration}s`,
            '--marquee-direction': reverse ? 'reverse' : 'normal',
          } as React.CSSProperties
        }
      >
        {[...repeated, ...repeated].map((item, idx) => (
          <span
            key={idx}
            className="mx-3 md:mx-4 inline-flex items-center gap-3 whitespace-nowrap py-1.5 text-[13px] md:text-[15px] font-medium tracking-wide text-gray-300 transition-colors duration-300 hover:text-white"
          >
            <span className="text-white/30" aria-hidden="true">
              ·
            </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

interface BioWord {
  text: string;
  className?: string;
}

const EMPHASIS_PRIMARY = 'font-bold text-white';
const EMPHASIS_ACCENT = 'font-semibold text-[var(--accent)]';

const BIO_WORDS: BioWord[] = [
  { text: 'I' },
  { text: 'am' },
  { text: 'a' },
  { text: 'final-year', className: EMPHASIS_PRIMARY },
  { text: 'B.Tech', className: EMPHASIS_PRIMARY },
  { text: 'undergraduate', className: EMPHASIS_PRIMARY },
  { text: 'in' },
  { text: 'Computer', className: EMPHASIS_PRIMARY },
  { text: 'Science', className: EMPHASIS_PRIMARY },
  { text: 'and', className: EMPHASIS_PRIMARY },
  { text: 'Engineering,', className: EMPHASIS_PRIMARY },
  { text: 'specializing' },
  { text: 'in' },
  { text: 'Artificial', className: EMPHASIS_ACCENT },
  { text: 'Intelligence', className: EMPHASIS_ACCENT },
  { text: 'and', className: EMPHASIS_ACCENT },
  { text: 'Machine', className: EMPHASIS_ACCENT },
  { text: 'Learning', className: EMPHASIS_ACCENT },
  { text: 'at' },
  { text: 'Vellore', className: EMPHASIS_PRIMARY },
  { text: 'Institute', className: EMPHASIS_PRIMARY },
  { text: 'of', className: EMPHASIS_PRIMARY },
  { text: 'Technology,', className: EMPHASIS_PRIMARY },
  { text: 'Bhopal.', className: EMPHASIS_PRIMARY },
  { text: 'Originally' },
  { text: 'from' },
  { text: 'Agartala,', className: EMPHASIS_PRIMARY },
  { text: 'Tripura,', className: EMPHASIS_PRIMARY },
  { text: 'and' },
  { text: 'currently' },
  { text: 'based' },
  { text: 'in' },
  { text: 'Madhya', className: EMPHASIS_PRIMARY },
  { text: 'Pradesh,', className: EMPHASIS_PRIMARY },
  { text: 'my' },
  { text: 'engineering' },
  { text: 'journey' },
  { text: 'began' },
  { text: 'early' },
  { text: 'with' },
  { text: 'national-level', className: EMPHASIS_ACCENT },
  { text: 'robotics', className: EMPHASIS_ACCENT },
  { text: 'builds', className: EMPHASIS_ACCENT },
  { text: 'at' },
  { text: 'the' },
  { text: 'ATAL', className: EMPHASIS_PRIMARY },
  { text: 'Tinkering', className: EMPHASIS_PRIMARY },
  { text: 'Lab.', className: EMPHASIS_PRIMARY },
  { text: 'Today,' },
  { text: 'I' },
  { text: 'specialize' },
  { text: 'in' },
  { text: 'bridging' },
  { text: 'high-level', className: EMPHASIS_ACCENT },
  { text: 'AI', className: EMPHASIS_ACCENT },
  { text: 'models', className: EMPHASIS_ACCENT },
  { text: 'with' },
  { text: 'low-level', className: EMPHASIS_PRIMARY },
  { text: 'embedded', className: EMPHASIS_PRIMARY },
  { text: 'hardware', className: EMPHASIS_PRIMARY },
  { text: 'and' },
  { text: 'enterprise', className: EMPHASIS_PRIMARY },
  { text: 'backend', className: EMPHASIS_PRIMARY },
  { text: 'systems.', className: EMPHASIS_PRIMARY },
];

export default function About() {
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  const sectionRef = useMotionScope<HTMLElement>(({ scope, desktop }) => {
    gsap.from('[data-intro]', {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: EASE_OUT,
      scrollTrigger: {
        trigger: scope,
        start: 'top 78%',
        once: true,
      },
    });

    if (!paragraphRef.current) return;

    if (desktop) {
      gsap.fromTo(
        paragraphRef.current.querySelectorAll('.word'),
        { opacity: 0.3 },
        {
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: paragraphRef.current,
            start: 'top 88%',
            end: 'bottom 60%',
            scrub: true,
          },
        }
      );
    } else {
      gsap.from(paragraphRef.current, {
        y: 24,
        opacity: 0,
        duration: DURATION,
        ease: EASE_OUT,
        scrollTrigger: {
          trigger: paragraphRef.current,
          start: 'top 90%',
          once: true,
        },
      });
    }
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-[#050505] text-white pt-24 pb-0 px-6 md:px-16 flex flex-col justify-center relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full z-10 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 md:gap-12 lg:gap-24 items-center">
          <div className="flex flex-col items-center lg:items-start">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-gray-500 mb-4 md:mb-6">
              About me
            </span>
            <h2
              data-intro
              className="text-[18vw] md:text-[9rem] lg:text-[11rem] xl:text-[13rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800 drop-shadow-2xl leading-[0.85]"
            >
              Intro
            </h2>
          </div>

          <div className="relative bg-white/5 backdrop-blur-md px-5 py-7 md:p-10 lg:p-12 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/[0.07] transition-colors duration-300 text-left">
            <p
              ref={paragraphRef}
              lang="en"
              className="text-gray-300 text-[15px] sm:text-base md:text-lg lg:text-xl leading-[1.7] md:leading-relaxed font-light text-pretty hyphens-auto"
            >
              {BIO_WORDS.map((item, idx) => (
                <Fragment key={idx}>
                  <span className={`word ${item.className || ''}`}>{item.text}</span>
                  {idx < BIO_WORDS.length - 1 && ' '}
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-auto -mx-6 md:-mx-16 pt-10 pb-8 bg-[#030303]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center gap-4 px-6 md:px-16 mb-6">
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-gray-500 whitespace-nowrap">
            The stack
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        <ul className="sr-only">
          {STACK_ROWS.flatMap((row) => row.items).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="flex flex-col gap-2.5 md:gap-3">
          {STACK_ROWS.map((row) => (
            <MarqueeRow
              key={row.label}
              items={row.items}
              copies={row.copies}
              duration={row.duration}
              reverse={row.reverse}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
