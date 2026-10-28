import { ReactNode } from 'react';
import { site } from '../config/site';
import { EASE_OUT, gsap, useMotionScope } from '../lib/motion';

const CONTACT_BG_VIDEO = '/assets/contact_assets/contact_bg.mp4';
const LINKEDIN_URL = 'https://www.linkedin.com/in/saumojyoti-chakraborty-412564278/';

interface SocialItem {
  label: string;
  href: string;
  icon: ReactNode;
  fill?: boolean;
}

const SOCIAL_LINKS: SocialItem[] = [
  {
    label: 'Instagram',
    href: site.socials.instagram,
    icon: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </>
    ),
  },
  {
    label: 'LinkedIn',
    href: site.socials.linkedin,
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: 'GitHub',
    href: site.socials.github,
    icon: (
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    ),
  },
];

function RowArrow() {
  return (
    <svg
      className="w-4 h-4 shrink-0 text-gray-500 opacity-0 -translate-x-2 transition-[opacity,transform,color] duration-500 ease-out group-hover/row:opacity-100 group-hover/row:translate-x-0 group-hover/row:text-white group-focus-visible/row:opacity-100 group-focus-visible/row:translate-x-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

interface ContactRowProps {
  label: string;
  value: string;
  href?: string;
  breakAll?: boolean;
}

function ContactRow({ label, value, href, breakAll }: ContactRowProps) {
  const inner = (
    <>
      <span data-row-inner className="min-w-0">
        <span className="block text-[10px] uppercase tracking-[0.28em] text-gray-500 mb-2">
          {label}
        </span>
        <span
          className={`block text-base md:text-lg tracking-wide text-white/85 transition-colors duration-500 group-hover/row:text-white ${
            breakAll ? 'break-all' : ''
          }`}
        >
          {value}
        </span>
      </span>
      {href && <RowArrow />}
    </>
  );

  const rowClasses =
    'group/row flex items-center justify-between gap-4 px-6 md:px-8 py-5 md:py-6 overflow-hidden transition-colors duration-500';

  return href ? (
    <a
      href={href}
      className={`${rowClasses} hover:bg-white/[0.05] focus-visible:bg-white/[0.05] outline-none`}
    >
      {inner}
    </a>
  ) : (
    <div className={rowClasses}>{inner}</div>
  );
}

export default function Contact() {
  const sectionRef = useMotionScope<HTMLDivElement>(({ scope, desktop }) => {
    const panel = scope.querySelector('[data-contact-panel]');
    const cleanups: (() => void)[] = [];

    if (panel) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
            once: true,
          },
        })
        .from(panel, {
          y: 48,
          opacity: 0,
          duration: 1.1,
          ease: EASE_OUT,
        })
        .from(
          panel.querySelectorAll('[data-row-inner]'),
          {
            yPercent: 105,
            opacity: 0,
            duration: 0.85,
            ease: EASE_OUT,
            stagger: 0.08,
          },
          '-=0.75'
        );

      if (desktop) {
        gsap.fromTo(
          panel,
          { yPercent: 3.5 },
          {
            yPercent: -3.5,
            ease: 'none',
            scrollTrigger: {
              trigger: scope,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }
    }

    if (window.matchMedia('(pointer: fine)').matches) {
      scope.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const strength = parseFloat(el.dataset.magnetic || '0.3') || 0.3;
        const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' });

        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
          yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        el.addEventListener('blur', onLeave);
        cleanups.push(() => {
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
          el.removeEventListener('blur', onLeave);
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <div
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen text-white font-sans flex flex-col overflow-hidden [clip-path:inset(0)]"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="fixed top-0 left-0 w-full h-[100vh] object-cover z-0"
      >
        <source src={CONTACT_BG_VIDEO} type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-0 bg-black/70 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 pt-28 pb-16 md:pt-32 flex-1 flex items-center">
        <div className="w-full flex flex-col lg:flex-row gap-14 lg:gap-24">
          <div className="w-full lg:w-6/12 flex flex-col">
            <div data-reveal className="mb-7">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-md px-3.5 py-1.5 text-[10px] md:text-[11px] uppercase tracking-[0.26em] text-gray-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-halo" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Available for work
              </span>
            </div>

            <h2
              data-reveal-lines
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter drop-shadow-2xl mb-7 leading-[0.95]"
            >
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="line block text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800">
                  Get in touch
                </span>
              </span>
            </h2>

            <p
              data-reveal
              data-reveal-delay="0.15"
              className="text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-md"
            >
              Open for freelance work, research collaborations and engineering roles — AI & ML,
              robotics simulation and backend systems in particular.
            </p>

            <div data-reveal-group="0.12" className="flex flex-wrap gap-3 mt-10">
              <a
                data-magnetic="0.28"
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 py-3.5 rounded-full bg-[var(--accent)] text-black text-sm font-medium inline-flex items-center gap-2.5 shadow-lg shadow-black/30 transition-[background-color,box-shadow] duration-300 ease-out hover:bg-[var(--accent-hover)] hover:shadow-xl hover:shadow-black/40 whitespace-nowrap shrink-0"
              >
                Linkedin
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 transition-transform duration-300 ease-out group-hover:scale-110"
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

              <a
                data-magnetic="0.28"
                href={`mailto:${site.email}`}
                className="group px-6 py-3.5 rounded-full border border-white/25 text-white text-sm inline-flex items-center gap-2.5 backdrop-blur-md transition-[background-color,color,border-color] duration-300 ease-out hover:bg-white hover:text-black hover:border-white whitespace-nowrap shrink-0"
              >
                Send an email
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="w-full lg:w-6/12 flex lg:items-center">
            <div
              data-contact-panel
              className="w-full rounded-3xl border border-white/10 bg-white/[0.045] backdrop-blur-xl shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)] overflow-hidden divide-y divide-white/[0.08]"
            >
              <ContactRow
                label="Email"
                value={site.email}
                href={`mailto:${site.email}`}
                breakAll
              />
              <ContactRow label="Phone" value={site.phone} />
              <ContactRow label="Based in" value={site.location} />

              <div className="px-6 md:px-8 py-6 md:py-7 overflow-hidden">
                <div data-row-inner>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500 mb-4">
                    Elsewhere
                  </p>
                  <div className="flex items-center gap-3">
                    {SOCIAL_LINKS.map((social) => (
                      <a
                        key={social.label}
                        data-magnetic="0.35"
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        title={social.label}
                        className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.07] flex items-center justify-center transition-[background-color,color,border-color] duration-300 ease-out hover:bg-white hover:text-black hover:border-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill={social.fill ? 'currentColor' : 'none'}
                          stroke={social.fill ? 'none' : 'currentColor'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          {social.icon}
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 pb-9">
        <div className="border-t border-white/10 pt-6 flex flex-col-reverse md:flex-row md:items-center justify-between gap-5 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
