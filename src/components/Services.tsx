import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useMotionScope } from '../lib/motion';

export interface EducationMilestone {
  id: string;
  category: string;
  title: string;
  institution: string;
  period: string;
  highlights: string;
  metric?: string;
  coursework: string[];
}

export const EDUCATION_MILESTONES: EducationMilestone[] = [
  {
    id: '01',
    category: 'University Education',
    title: 'B.Tech in Computer Science & Engineering (AI & ML)',
    institution: 'Vellore Institute of Technology, Bhopal',
    period: 'Sep 2023 - June 2027',
    metric: '8.19 CGPA',
    highlights:
      '8.19 CGPA. Core coursework includes Computer Vision, Deep Learning, Applied Linear Algebra, and Data Mining.',
    coursework: [
      'Computer Vision',
      'Deep Learning',
      'Applied Linear Algebra',
      'Data Mining',
    ],
  },
  {
    id: '02',
    category: 'Higher Secondary Education',
    title: 'Higher Secondary Education (PCMB)',
    institution: 'Kendriya Vidyalaya Kunjaban, Agartala',
    period: 'April 2022 - May 2023',
    highlights:
      'Core science curriculum focusing on Physics, Chemistry, Mathematics, and Biology.',
    coursework: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
  },
];

export default function Services() {
  const headerScopeRef = useMotionScope<HTMLDivElement>();
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 55%'],
  });

  const linePathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="education"
      className="bg-[#050505] text-white pt-14 pb-20 md:pt-20 md:pb-24 px-6 md:px-16 flex flex-col relative overflow-hidden"
    >
      <span id="service" className="sr-only" aria-hidden="true" />

      <div
        ref={headerScopeRef}
        className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mt-2 z-10 pb-8 md:pb-10 border-b border-white/15"
      >
        <div className="w-full md:w-auto flex flex-col items-start">
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-gray-500 mb-3">
            Education & Credentials
          </span>
          <p className="text-gray-400 text-sm md:text-base font-light max-w-md leading-relaxed">
            Academic foundation in artificial intelligence, mathematical modeling, and core physical
            sciences.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-end gap-4 pr-2 md:pr-0 text-right ml-auto">
          <h2
            data-reveal-lines
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter drop-shadow-2xl leading-[0.9] text-right uppercase"
          >
            {['ACADEMIC', 'BACKGROUND'].map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span className="line block text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800">
                  {line}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      <div ref={timelineRef} className="max-w-7xl mx-auto w-full relative pt-10 md:pt-12">
        <div className="relative grid grid-cols-[36px_1fr] md:grid-cols-[64px_1fr] gap-6 md:gap-10 items-start">
          {/* Left Vertical Track strictly bounded so the SVG timeline line stays short and never extends past the cards */}
          <div className="relative self-stretch">
            <div className="absolute top-7 bottom-24 md:top-8 md:bottom-28 left-1/2 -translate-x-1/2 w-6">
              <svg
                className="w-full h-full block overflow-visible"
                viewBox="0 0 24 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <line
                  x1="12"
                  y1="0"
                  x2="12"
                  y2="100"
                  stroke="rgba(255, 255, 255, 0.14)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                <motion.line
                  x1="12"
                  y1="0"
                  x2="12"
                  y2="100"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ pathLength: linePathLength }}
                />
              </svg>
            </div>
          </div>

          {/* Right Milestone Cards */}
          <div className="flex flex-col gap-8 md:gap-10">
            {EDUCATION_MILESTONES.map((milestone) => (
              <motion.div
                key={milestone.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ margin: '-25% 0px -25% 0px', once: true }}
                className="relative flex items-start"
              >
                {/* Circular SVG Node on the Left Track */}
                <div
                  className="absolute -left-[42px] md:-left-[72px] -translate-x-1/2 top-7 md:top-8 w-7 h-7 flex items-center justify-center z-20"
                  aria-hidden="true"
                >
                  <motion.svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    variants={{
                      hidden: { scale: 0 },
                      visible: { scale: 1 },
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    className="overflow-visible drop-shadow-[0_0_12px_rgba(232,228,220,0.45)]"
                  >
                    <circle
                      cx="14"
                      cy="14"
                      r="9"
                      fill="#050505"
                      stroke="var(--accent)"
                      strokeWidth="2.2"
                    />
                    <circle cx="14" cy="14" r="3.8" fill="var(--accent)" />
                  </motion.svg>
                </div>

                {/* Milestone Card */}
                <motion.article
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="w-full bg-white/[0.04] hover:bg-white/[0.06] backdrop-blur-md border border-white/10 border-t-2 border-t-[var(--accent)]/80 p-6 sm:p-8 md:p-10 transition-colors duration-300"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-gray-400 tabular-nums">
                      <span className="text-[var(--accent)] font-bold">{milestone.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{milestone.category}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs md:text-sm font-mono uppercase tracking-[0.16em] text-[var(--accent)] tabular-nums">
                      <span>{milestone.period}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight mb-2">
                    {milestone.title}
                  </h3>

                  <p className="text-sm sm:text-base md:text-lg font-medium text-gray-200 tracking-wide mb-4 tabular-nums">
                    {milestone.institution}{' '}
                    <span className="text-white/30 mx-1.5" aria-hidden="true">
                      |
                    </span>{' '}
                    <span className="text-gray-400 font-normal">{milestone.period}</span>
                  </p>

                  <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-3xl mb-6 tabular-nums">
                    {milestone.highlights}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.14em] text-gray-400 tabular-nums">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <span className="text-gray-500">Focus:</span>
                      {milestone.coursework.map((course, i) => (
                        <span key={course} className="inline-flex items-center gap-2.5 text-gray-300">
                          {i > 0 && (
                            <span className="text-white/25" aria-hidden="true">
                              ·
                            </span>
                          )}
                          <span>{course}</span>
                        </span>
                      ))}
                    </div>

                    {milestone.metric && (
                      <span className="text-[var(--accent)] font-bold tracking-[0.18em]">
                        {milestone.metric}
                      </span>
                    )}
                  </div>
                </motion.article>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
