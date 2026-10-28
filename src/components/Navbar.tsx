import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '../config/site';

const NAV_ITEMS = ['Home', 'About', 'Education', 'Experience', 'Project', 'Certifications', 'Contact'];
const [FIRST_NAME, ...REST_NAME] = site.name.split(' ');
const LAST_NAME = REST_NAME.join(' ');

export interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rafPendingRef = useRef(false);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 24);
      setScrollProgress(maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0);
      rafPendingRef.current = false;
    };

    const onScroll = () => {
      if (!rafPendingRef.current) {
        rafPendingRef.current = true;
        window.requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const elements = NAV_ITEMS.map((item) => document.getElementById(item.toLowerCase())).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (!elements.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      setMobileMenuOpen(false);
      const targetEl = document.getElementById(sectionId);
      if (targetEl) {
        e.preventDefault();
        setActiveSection(sectionId);
        targetEl.scrollIntoView({ behavior: 'smooth' });
      } else if (onNavigate) {
        e.preventDefault();
        onNavigate(sectionId);
      }
    },
    [onNavigate]
  );

  return (
    <>
      <nav
        aria-label="Main"
        className={`fixed top-0 left-0 w-full z-50 transition-[transform,opacity,background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          mounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        } ${
          mobileMenuOpen || scrolled
            ? 'bg-black/70 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="flex items-center justify-between gap-8 px-6 py-5 md:px-12 md:py-6">
          <a
            href="#home"
            aria-label={site.name}
            onClick={(e) => handleNavClick(e, 'home')}
            className="group relative z-50 text-white font-black text-xl md:text-2xl tracking-widest uppercase leading-none rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-black whitespace-nowrap shrink-0"
          >
            <span
              aria-hidden="true"
              className="inline-block transition-colors duration-300 group-hover:text-[var(--accent)]"
            >
              {FIRST_NAME}
              {LAST_NAME && (
                <span className="hidden md:inline-block overflow-hidden align-bottom">
                  <span className="inline-block translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:translate-x-1">
                    {'\u00A0'}
                    {LAST_NAME}
                  </span>
                </span>
              )}
            </span>
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:scale-x-100" />
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const id = item.toLowerCase();
              const isCurrent = activeSection === id;
              return (
                <li key={item}>
                  <a
                    href={`#${id}`}
                    aria-current={isCurrent ? 'true' : undefined}
                    onClick={(e) => handleNavClick(e, id)}
                    className={`group relative block py-1 text-sm uppercase tracking-wider font-medium transition-colors duration-300 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-black whitespace-nowrap shrink-0 ${
                      isCurrent
                        ? 'text-[var(--accent)]'
                        : 'text-gray-300 hover:text-[var(--accent)]'
                    }`}
                  >
                    {item}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px w-full bg-[var(--accent)] origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                        isCurrent ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            ref={menuBtnRef}
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="relative z-50 flex md:hidden flex-col justify-center items-center w-10 h-10 rounded-full border border-white/15 bg-white/5 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <span
              className={`block w-4 h-0.5 bg-current transition-transform duration-300 ${
                mobileMenuOpen ? 'translate-y-1 rotate-45' : '-translate-y-1'
              }`}
            />
            <span
              className={`block w-4 h-0.5 bg-current transition-opacity duration-300 ${
                mobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block w-4 h-0.5 bg-current transition-transform duration-300 ${
                mobileMenuOpen ? '-translate-y-1 -rotate-45' : 'translate-y-1'
              }`}
            />
          </button>
        </div>

        <div
          aria-hidden="true"
          className="h-[1px] w-full origin-left bg-gradient-to-r from-white/40 via-[var(--accent)] to-white/40 transition-transform duration-150"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </nav>

      <div
        id="mobile-menu"
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0a0a0a] transition-[opacity,visibility] duration-500 ease-out motion-reduce:transition-none md:hidden ${
          mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col items-center gap-8">
          {NAV_ITEMS.map((item, idx) => {
            const id = item.toLowerCase();
            return (
              <li
                key={item}
                className={`transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: mobileMenuOpen ? `${120 + idx * 60}ms` : '0ms' }}
              >
                <a
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className="block text-3xl font-black uppercase tracking-widest text-white transition-colors duration-300 hover:text-[var(--accent)] active:text-[var(--accent)] outline-none focus-visible:text-[var(--accent)]"
                >
                  {item}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
