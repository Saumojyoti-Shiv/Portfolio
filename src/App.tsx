/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import About from './components/About';
import ComingSoon from './components/ComingSoon';
import ComponentsShowcase from './components/ComponentsShowcase';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Project from './components/Project';
import Ricochet from './components/Ricochet';
import Services from './components/Services';

export default function App() {
  const [preloadComplete, setPreloadComplete] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  if (showComingSoon) {
    return <ComingSoon onBack={() => setShowComingSoon(false)} />;
  }

  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-[var(--accent)] selection:text-black">
      <Hero onPreloadComplete={() => setPreloadComplete(true)} />
      {preloadComplete && (
        <div>
          <Navbar />
          <About />
          <Services />
          <Experience />
          <Project onCtaClick={() => setShowComingSoon(true)} />
          <ComponentsShowcase />
          <section
            id="play"
            className="bg-[#050505] text-white py-24 md:py-32 px-4 sm:px-6 md:px-16"
          >
            <div className="mx-auto max-w-5xl">
              <Ricochet
                lines={['Hello', 'World']}
                caption="Break it if you can. It still ships."
                panelClassName="aspect-[5/6] sm:aspect-[4/3] lg:aspect-[16/9]"
              />
            </div>
          </section>
          <Contact />
        </div>
      )}
    </main>
  );
}
