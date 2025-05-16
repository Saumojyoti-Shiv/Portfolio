import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Education from '@/components/portfolio/Education';
import Certifications from '@/components/portfolio/Certifications';
import Skills from '@/components/portfolio/Skills';
import Projects from '@/components/portfolio/Projects';
import Contact from '@/components/portfolio/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Education />
      <Skills />
      <Certifications />
      <Projects />
      <Contact />
    </>
  );
}
