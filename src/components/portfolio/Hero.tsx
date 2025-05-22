import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, MapPin, Download } from 'lucide-react';
import { SectionAnimator } from './SectionAnimator';

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-secondary/20 opacity-50"></div>
      <div className="container text-center relative z-10 px-4">
        <SectionAnimator animationClass="animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-heading mb-4">
            Saumojyoti Chakraborty
          </h1>
        </SectionAnimator>
        <SectionAnimator animationClass="animate-fade-in-up" delay="delay-200">
          <p className="text-lg sm:text-xl md:text-2xl text-primary mb-6 font-medium">
            Robotics | AI & ML Enthusiast | Innovator in Interactive Digital Solutions
          </p>
        </SectionAnimator>
        <SectionAnimator animationClass="animate-fade-in-up" delay="delay-300">
          <div className="flex items-center justify-center text-muted-foreground mb-8 text-lg">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Agartala, India
          </div>
        </SectionAnimator>
        
        <SectionAnimator animationClass="animate-fade-in-up" delay="delay-400">
          <div className="flex justify-center space-x-4 mb-10">
            <Button variant="outline" size="icon" asChild className="hover:bg-primary hover:text-primary-foreground transition-all transform hover:scale-110">
              <Link href="https://github.com/Saumojyoti-Shiv" target="_blank" aria-label="GitHub">
                <Github className="h-6 w-6" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild className="hover:bg-primary hover:text-primary-foreground transition-all transform hover:scale-110">
              <Link href="https://www.linkedin.com/in/saumojyoti-chakraborty-412564278/" target="_blank" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild className="hover:bg-primary hover:text-primary-foreground transition-all transform hover:scale-110">
              <Link href="mailto:chakraborty.saumojyoti@gmail.com" aria-label="Email">
                <Mail className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </SectionAnimator>
        
        <SectionAnimator animationClass="animate-fade-in-up" delay="delay-500">
           <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground transition-all transform hover:scale-105" asChild>
            <Link href="#contact">
              Get In Touch
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </Button>
        </SectionAnimator>
      </div>
       {/* Subtle background elements if desired */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-card/30 to-transparent pointer-events-none"></div>
    </section>
  );
}

