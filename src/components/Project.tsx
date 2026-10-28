import { ReactNode } from 'react';
import { useMotionScope } from '../lib/motion';

export interface ProjectItem {
  name: string;
  subtitle?: string;
  title: ReactNode;
  description: ReactNode;
  specs?: string[];
  image: string;
  repo: string;
}

export const SAMPLE_PROJECTS: ProjectItem[] = [
  {
    name: 'Autonomous UAV Navigation',
    subtitle: 'Deep RL · Decentralized Autonomous UAV Navigation',
    title: (
      <>
        AUTONOMOUS{' '}
        <span className="font-light italic text-gray-300 lowercase font-serif">
          uav
        </span>
        <br />
        NAVIGATION
      </>
    ),
    description: (
      <>
        Engineered an end-to-end{' '}
        <strong className="font-semibold text-white">
          Deep Reinforcement Learning
        </strong>{' '}
        framework that dynamically avoids obstacles and seeks targets in{' '}
        <strong className="font-semibold text-[var(--accent)]">
          GPS-denied 3D environments
        </strong>{' '}
        without global maps. Implemented a{' '}
        <strong className="font-semibold text-white">
          Soft Actor-Critic (SAC)
        </strong>{' '}
        algorithm processing live{' '}
        <strong className="font-semibold text-[var(--accent)]">
          24-point LiDAR and camera feeds
        </strong>{' '}
        across <strong className="font-semibold text-white">50,000+ timesteps</strong>,
        and integrated{' '}
        <strong className="font-semibold text-[var(--accent)]">
          federated learning
        </strong>{' '}
        for decentralized swarm intelligence and synchronized neural network weights.
      </>
    ),
    specs: ['ROS 2', 'Gazebo 3D', 'Soft Actor-Critic (SAC)', '24-Point LiDAR', 'Federated Learning'],
    image: '/assets/aistudio/1_Autonomous_UAV_Navigation_4460a83b.jpg',
    repo: 'https://github.com/Saumojyoti-Shiv/Autonomous_UAV_Navigation',
  },
  {
    name: 'NotifyGrid',
    subtitle: 'Enterprise-Grade Bulk Messaging Ecosystem',
    title: (
      <>
        NOTIFY{' '}
        <span className="font-light italic text-gray-300 lowercase font-serif">
          grid
        </span>
        <br />
        MESSAGING ECOSYSTEM
      </>
    ),
    description: (
      <>
        Architected a high-performance enterprise backend orchestrating{' '}
        <strong className="font-semibold text-white">
          10+ independent RESTful microservices
        </strong>
        . Integrated{' '}
        <strong className="font-semibold text-[var(--accent)]">RabbitMQ</strong> for
        asynchronous message processing and secured communication channels using{' '}
        <strong className="font-semibold text-white">
          OAuth2 and JWT-based Role-Based Access Control (RBAC)
        </strong>
        . Built a scalable architecture with{' '}
        <strong className="font-semibold text-[var(--accent)]">
          Docker, API Gateway, and Eureka Service Discovery
        </strong>
        , ensuring full compliance with{' '}
        <strong className="font-semibold text-white">TRAI DLT regulations</strong>.
      </>
    ),
    specs: ['Spring Boot 4', 'RabbitMQ', 'OAuth2 & JWT RBAC', 'API Gateway', 'Eureka', 'Docker'],
    image: '/assets/aistudio/2_NotifyGrid_7e8f4336.jpg',
    repo: 'https://github.com/Saumojyoti-Shiv/NotifyGrid',
  },
  {
    name: 'Vision-Language-Action (VLA) Robotic Arm',
    subtitle: 'Multimodal AI · Real-Time Hardware Actuation',
    title: (
      <>
        VLA{' '}
        <span className="font-light italic text-gray-300 lowercase font-serif">
          robotic
        </span>
        <br />
        MANIPULATION ARM
      </>
    ),
    description: (
      <>
        Engineered an{' '}
        <strong className="font-semibold text-white">autonomous robotic arm</strong>{' '}
        controlled via a state-of-the-art{' '}
        <strong className="font-semibold text-[var(--accent)]">
          Vision-Language-Action (VLA)
        </strong>{' '}
        architecture with a{' '}
        <strong className="font-semibold text-white">
          real-time inference pipeline
        </strong>{' '}
        bridging multimodal AI reasoning and physical actuation. Utilizes{' '}
        <strong className="font-semibold text-[var(--accent)]">
          ROS 2 and Python
        </strong>{' '}
        to translate natural language instructions and live{' '}
        <strong className="font-semibold text-white">RGB camera perception</strong>{' '}
        directly into continuous joint trajectories and end-effector control, validated
        with{' '}
        <strong className="font-semibold text-[var(--accent)]">
          G-Test and the ROS Test Framework
        </strong>
        .
      </>
    ),
    specs: ['VLA Model', 'ROS 2', 'Python', 'RGB Perception', 'G-Test', 'ROS Test Framework'],
    image: '/assets/aistudio/3_Vision-Language-Action__VLA__Robotic_Arm_cc4005a3.jpeg',
    repo: 'https://github.com/Saumojyoti-Shiv',
  },
  {
    name: 'AI Knowledge Assistant',
    subtitle: 'Unified Multimodal & Domain-Specific Intelligence Platform',
    title: (
      <>
        AI KNOWLEDGE{' '}
        <span className="font-light italic text-gray-300 lowercase font-serif">
          assistant
        </span>
        <br />
        INTELLIGENCE PLATFORM
      </>
    ),
    description: (
      <>
        A full-stack,{' '}
        <strong className="font-semibold text-white">
          local-first artificial intelligence platform
        </strong>{' '}
        designed to handle{' '}
        <strong className="font-semibold text-[var(--accent)]">
          document ingestion, multi-modal vision reasoning
        </strong>
        , domain-specific{' '}
        <strong className="font-semibold text-white">
          clinical and scientific retrieval
        </strong>
        , emotional sentiment adaptation, and cross-lingual communication. The entire
        intelligence and retrieval pipeline runs{' '}
        <strong className="font-semibold text-[var(--accent)]">
          locally without external paid API keys or third-party cloud LLMs
        </strong>
        —executing all{' '}
        <strong className="font-semibold text-white">
          vectorization, computer vision processing, named entity recognition, and
          sentiment classification
        </strong>{' '}
        on a custom-built, in-engine algorithmic foundation.
      </>
    ),
    specs: [
      'Local-First AI',
      'Multi-Modal Vision',
      'Clinical & Scientific RAG',
      'In-Engine Vectorization',
      'Custom NER & Sentiment',
      'Cross-Lingual',
    ],
    image: '/assets/aistudio/4_AI_Knowledge_Assistant_ca877ed9.png',
    repo: 'https://github.com/Saumojyoti-Shiv',
  },
];

export interface ProjectProps {
  onCtaClick?: () => void;
}

export default function Project({ onCtaClick }: ProjectProps) {
  const sectionRef = useMotionScope<HTMLDivElement>();

  return (
    <div
      ref={sectionRef}
      id="project"
      className="bg-[#050505] w-full text-white pt-10 md:pt-20 pb-24 px-6 md:px-16"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start w-full z-10 gap-12 lg:gap-0 mb-20 lg:mb-32">
        <div className="w-full lg:w-7/12 overflow-visible">
          <h2
            data-reveal-lines
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter drop-shadow-2xl leading-[0.9] uppercase whitespace-nowrap"
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="line flex items-center gap-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800">
                  Selected
                </span>
                <span className="font-light italic text-gray-300 lowercase font-serif pr-4 pt-2 md:pt-4">
                  work
                </span>
              </span>
            </span>
          </h2>
        </div>

        <div
          data-reveal-group
          className="w-full lg:w-4/12 flex flex-col items-start lg:mt-4"
        >
          <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed">
            Bridging deep reinforcement learning, multimodal robotics perception, and high-throughput
            distributed backend architectures for real-world deployment.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-24 lg:gap-40 w-full">
        {SAMPLE_PROJECTS.map((project, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={project.name}
              className={`flex flex-col ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center justify-between gap-12 lg:gap-16 w-full group`}
            >
              <div
                data-reveal={isEven ? 'left' : 'right'}
                data-parallax-frame
                className="w-full lg:w-6/12 overflow-hidden relative aspect-[16/10] bg-[#111] rounded-sm border border-white/10"
              >
                <img
                  src={project.image}
                  alt={project.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  data-parallax="60"
                  className="w-full h-[112%] -mt-[6%] object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
              </div>

              <div
                data-reveal-group="0.1"
                className="w-full lg:w-5/12 flex flex-col items-start"
              >
                <div className="flex items-center gap-3 text-xs md:text-sm font-mono uppercase tracking-widest mb-3 tabular-nums">
                  <span className="text-[var(--accent)] font-bold">0{idx + 1}</span>
                  {project.subtitle && (
                    <>
                      <span className="text-white/30" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-gray-400 text-[11px] md:text-xs tracking-[0.16em]">
                        {project.subtitle}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[1.1] uppercase mb-5">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed mb-6">
                  {project.description}
                </p>
                {project.specs && (
                  <div className="pt-3.5 pb-6 border-t border-white/10 w-full flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-gray-400 tabular-nums">
                    {project.specs.map((spec, sIdx) => (
                      <span key={spec} className="inline-flex items-center gap-2.5">
                        {sIdx > 0 && (
                          <span className="text-white/25" aria-hidden="true">
                            ·
                          </span>
                        )}
                        <span>{spec}</span>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4 flex-wrap">
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer px-6 py-2.5 rounded-full border border-white/30 text-white text-xs md:text-sm hover:bg-white hover:text-black transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
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
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20 lg:mt-28 pt-10 border-t border-white/10 flex justify-center">
        <a
          href="https://github.com/Saumojyoti-Shiv"
          target="_blank"
          rel="noopener noreferrer"
          className="group cursor-pointer px-8 py-3.5 rounded-full border border-[var(--accent)] bg-[var(--accent)] text-black font-bold text-xs md:text-sm uppercase tracking-[0.16em] hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)] transition-colors inline-flex items-center gap-3 shadow-[0_0_28px_-6px_var(--accent)] whitespace-nowrap"
        >
          More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
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
  );
}
