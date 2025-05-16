import { Section } from './Section';
import Image from 'next/image';
import { Brain, Rocket, GraduationCap } from 'lucide-react';

export default function About() {
  return (
    <Section id="about" title="About Me" animationType="slide-in-left">
      <div className="grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl group transform transition-all duration-500 hover:scale-105">
            <Image 
              src="/profile-picture1.jpg" 
              alt="Saumojyoti Chakraborty" 
              layout="fill"
              objectFit="cover"
              className="transform transition-all duration-500 group-hover:scale-110"
              data-ai-hint="professional portrait"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
        <div className="md:col-span-3 text-lg text-muted-foreground space-y-6">
          <p>
            Hello! I'm Saumojyoti, a passionate and driven individual with a strong academic background in Computer Science, 
            specializing in the fascinating fields of Artificial Intelligence, Machine Learning, and Robotics. 
            My journey into technology is fueled by an insatiable curiosity and a desire to build intelligent systems that can solve real-world problems.
          </p>
          <p>
            I thrive on challenges and am constantly exploring new algorithms, tools, and techniques to expand my knowledge. 
            From developing predictive models to designing autonomous systems, I am dedicated to pushing the boundaries of what's possible.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
            <div className="flex items-center p-4 bg-card rounded-lg shadow-md">
              <GraduationCap className="h-8 w-8 text-primary mr-3" />
              <span>Strong academic foundation in CS</span>
            </div>
            <div className="flex items-center p-4 bg-card rounded-lg shadow-md">
              <Brain className="h-8 w-8 text-primary mr-3" />
              <span>Deep interest in AI & ML</span>
            </div>
            <div className="flex items-center p-4 bg-card rounded-lg shadow-md">
              <Rocket className="h-8 w-8 text-primary mr-3" />
              <span>Enthusiasm for Robotics</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
