
import { Section } from './Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Code2, Brain, Bot, Cpu, Wrench, Database, TerminalSquare, Lightbulb, BookOpenText, Users, Eye } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

// Placeholder for custom icons if Lucide doesn't have them or to match brand.
// For real app, these would be proper SVG components.
// Moved definitions before usage to fix initialization error
const GithubIcon = (props: LucideProps) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35.0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35.0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>;
const DockerIcon = (props: LucideProps) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 12.5c0-5.25-4.25-9.5-9.5-9.5S3 7.25 3 12.5m0 0c0 5.25 4.25 9.5 9.5 9.5s9.5-4.25 9.5-9.5M7 12.5h10M7 12.5a2.5 2.5 0 0 0-5 0M17 12.5a2.5 2.5 0 0 1 5 0"/></svg>;
const EyeIconComponent = (props: LucideProps) => <Eye {...props} />; // Using Lucide Eye icon

interface Skill {
  name: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> | ((props: LucideProps) => JSX.Element) ;
  level?: number; // Optional proficiency level (1-5)
}

interface SkillCategory {
  title: string;
  skills: Skill[];
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

const skillsData: SkillCategory[] = [
  {
    title: 'Technical Skills',
    icon: Cpu,
    skills: [
      { name: 'Python', icon: Code2, level: 5 },
      { name: 'Machine Learning', icon: Brain, level: 4 },
      { name: 'Deep Learning', icon: Brain, level: 3 },
      { name: 'Robotics (ROS, Gazebo)', icon: Bot, level: 4 },
      { name: 'Data Analysis (Pandas, NumPy)', icon: Database, level: 3 },
      { name: 'C/C++', icon: Code2, level: 5 },
    ],
  },
  {
    title: 'Tools & Technologies',
    icon: Wrench,
    skills: [
      { name: 'Git & GitHub', icon: GithubIcon, level: 4 },
      { name: 'Docker', icon: DockerIcon, level: 2 },
      { name: 'TensorFlow/Keras', icon: Brain, level: 2 },
      { name: 'PyTorch', icon: Brain, level: 2 },
      { name: 'Linux/Unix Shell', icon: TerminalSquare, level: 3 },
      { name: 'VS Code', icon: Code2, level: 5 },
    ],
  },
  {
    title: 'Domain Knowledge',
    icon: BookOpenText,
    skills: [
      { name: 'Natural Language Processing', icon: Lightbulb, level: 3 },
      { name: 'Computer Vision', icon: EyeIconComponent, level: 3 },
      { name: 'Agile Methodologies', icon: Users, level: 4 },
      { name: 'Problem Solving', icon: Lightbulb, level: 4 },
      { name: 'Algorithm Design', icon: Code2, level: 4 },
    ],
  },
];


export default function Skills() {
  return (
    <Section id="skills" title="Skills & Expertise" animationType="slide-in-left">
      <div className="grid lg:grid-cols-3 gap-8">
        {skillsData.map((category) => (
          <Card key={category.title} className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 flex flex-col transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center space-x-3 pb-4">
              <category.icon className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl font-semibold text-foreground">{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {category.skills.map((skill) => (
                  <li key={skill.name} className="flex items-center group">
                    <skill.icon className="h-5 w-5 mr-3 text-primary/80 group-hover:text-primary transition-colors" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{skill.name}</span>
                    {skill.level && (
                      <div className="ml-auto flex items-center space-x-1">
                        {Array(5).fill(0).map((_, i) => (
                          <span
                            key={i}
                            className={`h-2 w-4 rounded-sm ${
                              i < skill.level! ? 'bg-primary' : 'bg-muted'
                            } group-hover:bg-primary/50 ${ i < skill.level! && 'group-hover:!bg-primary' } transition-colors`}
                          />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
