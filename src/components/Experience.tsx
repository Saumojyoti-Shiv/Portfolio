import { Fragment, useRef } from 'react';
import { DURATION, EASE_OUT, gsap, useMotionScope } from '../lib/motion';

interface HighlightSegment {
  text: string;
  emphasis?: 'primary' | 'accent';
}

interface ExperienceRole {
  id: string;
  role: string;
  organization: string;
  period: string;
  domain: string;
  stack: string[];
  githubUrl: string;
  linkedinUrl: string;
  bullets: HighlightSegment[][];
}

const EMPHASIS_CLASS: Record<'primary' | 'accent', string> = {
  primary: 'font-bold text-white',
  accent: 'font-semibold text-[var(--accent)]',
};

export const EXPERIENCE_ROLES: ExperienceRole[] = [
  {
    id: '01',
    role: 'Software Engineer Intern',
    organization: 'National Informatics Centre (NIC), MeitY',
    period: 'May 2026 – Jun 2026',
    domain: 'Enterprise Backend & Distributed Messaging',
    stack: [
      'Java 23',
      'Spring Boot 4',
      'PostgreSQL',
      'RabbitMQ',
      'Docker',
      'API Gateway',
      'Eureka Service Discovery',
    ],
    githubUrl: 'https://github.com/Saumojyoti-Shiv/NotifyGrid',
    linkedinUrl: 'https://lnkd.in/p/dfH897Pg',
    bullets: [
      [
        { text: 'Engineered' },
        { text: 'NotifyGrid,', emphasis: 'accent' },
        { text: 'an' },
        { text: 'enterprise-grade,', emphasis: 'primary' },
        { text: 'microservices-based', emphasis: 'primary' },
        { text: 'bulk', emphasis: 'primary' },
        { text: 'messaging', emphasis: 'primary' },
        { text: 'platform', emphasis: 'primary' },
        { text: 'designed' },
        { text: 'for' },
        { text: 'secure', emphasis: 'accent' },
        { text: 'government', emphasis: 'accent' },
        { text: 'communications.', emphasis: 'accent' },
      ],
      [
        { text: 'The' },
        { text: 'product' },
        { text: 'is' },
        { text: 'currently' },
        { text: 'used' },
        { text: 'by' },
        { text: 'the' },
        { text: 'Tripura', emphasis: 'primary' },
        { text: 'Government', emphasis: 'primary' },
        { text: 'to' },
        { text: 'seamlessly' },
        { text: 'handle' },
        { text: 'their' },
        { text: 'massive', emphasis: 'accent' },
        { text: 'live', emphasis: 'accent' },
        { text: 'communication', emphasis: 'accent' },
        { text: 'workflows', emphasis: 'accent' },
        { text: 'and' },
        { text: 'production', emphasis: 'primary' },
        { text: 'traffic.', emphasis: 'primary' },
      ],
      [
        { text: 'Developed' },
        { text: 'core', emphasis: 'primary' },
        { text: 'microservices', emphasis: 'primary' },
        { text: 'using' },
        { text: 'Java 23,', emphasis: 'accent' },
        { text: 'Spring Boot 4,', emphasis: 'accent' },
        { text: 'PostgreSQL,', emphasis: 'accent' },
        { text: 'and' },
        { text: 'RabbitMQ', emphasis: 'accent' },
        { text: 'for' },
        { text: 'asynchronous', emphasis: 'primary' },
        { text: 'message', emphasis: 'primary' },
        { text: 'processing', emphasis: 'primary' },
        { text: 'to' },
        { text: 'ensure' },
        { text: 'zero', emphasis: 'accent' },
        { text: 'data', emphasis: 'accent' },
        { text: 'loss', emphasis: 'accent' },
        { text: 'during' },
        { text: 'high' },
        { text: 'traffic.' },
      ],
      [
        { text: 'Built' },
        { text: 'a' },
        { text: 'scalable', emphasis: 'primary' },
        { text: 'backend', emphasis: 'primary' },
        { text: 'architecture', emphasis: 'primary' },
        { text: 'utilizing' },
        { text: 'Docker,', emphasis: 'accent' },
        { text: 'API Gateway,', emphasis: 'accent' },
        { text: 'and' },
        { text: 'Eureka', emphasis: 'accent' },
        { text: 'Service', emphasis: 'accent' },
        { text: 'Discovery,', emphasis: 'accent' },
        { text: 'while' },
        { text: 'ensuring' },
        { text: 'full', emphasis: 'primary' },
        { text: 'compliance', emphasis: 'primary' },
        { text: 'with' },
        { text: 'TRAI DLT', emphasis: 'accent' },
        { text: 'regulations.', emphasis: 'primary' },
      ],
    ],
  },
  {
    id: '02',
    role: 'Robotics and Autonomous Systems Intern',
    organization: 'National Institute of Technology Agartala',
    period: 'Jun 2026 – Jul 2026',
    domain: 'Autonomous UAV Navigation & Reinforcement Learning',
    stack: [
      'ROS 2',
      '3D Gazebo',
      'Soft Actor-Critic (SAC)',
      '24-Point LiDAR',
      'Computer Vision',
      'Federated Learning',
    ],
    githubUrl: 'https://github.com/Saumojyoti-Shiv/Autonomous_UAV_Navigation',
    linkedinUrl: 'https://lnkd.in/p/dZqxZeeG',
    bullets: [
      [
        { text: 'Developed' },
        { text: 'an' },
        { text: 'autonomous', emphasis: 'primary' },
        { text: 'UAV', emphasis: 'primary' },
        { text: 'navigation', emphasis: 'primary' },
        { text: 'framework', emphasis: 'primary' },
        { text: 'in' },
        { text: 'a' },
        { text: '3D Gazebo', emphasis: 'accent' },
        { text: 'environment', emphasis: 'accent' },
        { text: 'using' },
        { text: 'ROS 2.', emphasis: 'accent' },
      ],
      [
        { text: 'Implemented' },
        { text: 'a' },
        { text: 'Soft', emphasis: 'accent' },
        { text: 'Actor-Critic', emphasis: 'accent' },
        { text: '(SAC)', emphasis: 'accent' },
        { text: 'reinforcement', emphasis: 'primary' },
        { text: 'learning', emphasis: 'primary' },
        { text: 'algorithm', emphasis: 'primary' },
        { text: 'processing' },
        { text: 'live' },
        { text: '24-point', emphasis: 'primary' },
        { text: 'LiDAR', emphasis: 'primary' },
        { text: 'and' },
        { text: 'camera', emphasis: 'primary' },
        { text: 'feeds,', emphasis: 'primary' },
        { text: 'training' },
        { text: 'the' },
        { text: 'agent' },
        { text: 'for' },
        { text: '50,000+ timesteps.', emphasis: 'accent' },
      ],
      [
        { text: 'Integrated' },
        { text: 'federated', emphasis: 'accent' },
        { text: 'learning', emphasis: 'accent' },
        { text: 'for' },
        { text: 'decentralized', emphasis: 'primary' },
        { text: 'swarm', emphasis: 'primary' },
        { text: 'intelligence', emphasis: 'primary' },
        { text: 'and' },
        { text: 'synchronized', emphasis: 'primary' },
        { text: 'neural', emphasis: 'primary' },
        { text: 'network', emphasis: 'primary' },
        { text: 'weights.', emphasis: 'primary' },
      ],
    ],
  },
];

function tokenizeSegment(segment: HighlightSegment): HighlightSegment[] {
  return segment.text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({ text: word, emphasis: segment.emphasis }));
}

export default function Experience() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sectionRef = useMotionScope<HTMLElement>(({ desktop }) => {
    cardRefs.current.forEach((cardEl) => {
      if (!cardEl) return;
      const words = cardEl.querySelectorAll('.exp-word');
      if (!words.length) return;

      if (desktop) {
        gsap.fromTo(
          words,
          { opacity: 0.28 },
          {
            opacity: 1,
            stagger: 0.06,
            scrollTrigger: {
              trigger: cardEl,
              start: 'top 86%',
              end: 'bottom 58%',
              scrub: true,
            },
          }
        );
      } else {
        gsap.from(cardEl, {
          y: 24,
          opacity: 0,
          duration: DURATION,
          ease: EASE_OUT,
          scrollTrigger: {
            trigger: cardEl,
            start: 'top 90%',
            once: true,
          },
        });
      }
    });
  });

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="bg-[#050505] w-full text-white pt-14 md:pt-20 pb-20 md:pb-28 px-6 md:px-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full gap-6 mb-12 md:mb-16">
          <div className="w-full lg:w-7/12 overflow-visible">
            <span className="block text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-gray-500 mb-3">
              Professional Track
            </span>
            <h2
              data-reveal-lines
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter drop-shadow-2xl leading-[0.9] uppercase whitespace-nowrap"
            >
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="line flex items-center gap-3 md:gap-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800">
                    Industry
                  </span>
                  <span className="font-light italic text-gray-300 lowercase font-serif pr-4 pt-2 md:pt-3">
                    experience
                  </span>
                </span>
              </span>
            </h2>
          </div>

          <div data-reveal-group className="w-full lg:w-4/12 flex flex-col items-start lg:items-end">
            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed lg:text-right">
              Production engineering across government-scale distributed backends and autonomous
              multi-sensor robotics simulations.
            </p>
          </div>
        </div>

        {/* Experience Split Dossier Rows */}
        <div className="flex flex-col divide-y divide-white/15 border-t border-b border-white/15">
          {EXPERIENCE_ROLES.map((item, roleIdx) => (
            <div
              key={item.id}
              className="py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
            >
              {/* Left Column: Role & Institution Metadata */}
              <div data-reveal="up" className="lg:col-span-5 flex flex-col items-start">
                <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.22em] text-[var(--accent)] mb-3 tabular-nums">
                  <span className="font-bold">{item.id}</span>
                  <span className="text-white/30" aria-hidden="true">
                    ·
                  </span>
                  <span>{item.period}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-[32px] font-black tracking-tight text-white leading-[1.1] mb-2.5">
                  {item.role}
                </h3>

                <p className="text-base md:text-lg font-medium text-gray-200 tracking-wide mb-2">
                  {item.organization}
                </p>

                <p className="text-xs font-mono uppercase tracking-[0.18em] text-gray-500 mb-6">
                  {item.domain}
                </p>

                {/* Clean Unboxed Stack Metadata */}
                <div className="pt-4 border-t border-white/10 w-full flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-gray-400 tabular-nums mb-6">
                  {item.stack.map((tech, techIdx) => (
                    <span key={tech} className="inline-flex items-center gap-2.5">
                      {techIdx > 0 && (
                        <span className="text-white/25" aria-hidden="true">
                          ·
                        </span>
                      )}
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>

                {/* Action Buttons: GitHub & LinkedIn Post */}
                <div className="flex items-center gap-3.5 flex-wrap">
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer px-5 py-2.5 rounded-full border border-[var(--accent)] bg-[var(--accent)] text-black text-xs md:text-sm font-medium hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    GitHub
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </a>

                  <a
                    href={item.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer px-5 py-2.5 rounded-full border border-white/30 text-white text-xs md:text-sm font-medium hover:bg-white hover:text-black transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    LinkedIn Post
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Right Column: Scroll-Scrubbed Highlight Dossier Card (About-style word illumination) */}
              <div
                ref={(el) => {
                  cardRefs.current[roleIdx] = el;
                }}
                className="lg:col-span-7 relative bg-white/5 backdrop-blur-md px-5 py-6 sm:p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.16)] hover:bg-white/[0.07] transition-colors duration-300"
              >
                <ul className="space-y-4 md:space-y-5">
                  {item.bullets.map((bulletSegments, bIdx) => {
                    const words = bulletSegments.flatMap(tokenizeSegment);
                    return (
                      <li
                        key={bIdx}
                        className="flex items-start gap-3.5 text-gray-300 text-[15px] sm:text-base md:text-[17px] leading-[1.68] font-light text-pretty"
                      >
                        <span
                          className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)] shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          {words.map((wordObj, wIdx) => (
                            <Fragment key={wIdx}>
                              <span
                                className={`exp-word ${
                                  wordObj.emphasis ? EMPHASIS_CLASS[wordObj.emphasis] : ''
                                }`}
                              >
                                {wordObj.text}
                              </span>
                              {wIdx < words.length - 1 && ' '}
                            </Fragment>
                          ))}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
