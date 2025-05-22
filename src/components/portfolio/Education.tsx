
import { Section } from './Section';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GraduationCap, CalendarDays, BookOpen } from 'lucide-react';

const educationData = [
  {
    institution: 'Vellore Institute of Technology (VIT), Bhopal',
    degree: 'B.Tech in Computer Science and Engineering (AI & ML)',
    dates: 'September 2023 – September 2027',
    focus: 'Artificial Intelligence, Machine Learning, CS Fundamentals',
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
  },
  {
    institution: 'Kendriya Vidyalaya, Agartala',
    degree: 'Higher Secondary – Science Stream (PCMB)',
    dates: 'Feb 2022 – Mar 2023',
    focus: 'Physics, Chemistry, Mathematics, Biology',
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
  },
];

export default function Education() {
  return (
    <Section id="education" title="Education" animationType="slide-in-right">
      <div className="relative">
        {/* Main Vertical Timeline line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2 hidden md:block z-0"></div>

        <div className="space-y-12">
          {educationData.map((edu, index) => (
            <div key={index} className="md:grid md:grid-cols-2 md:gap-x-12 items-start relative">
              {/* Card: placed in column 1 or 2 */}
              <div className={`relative ${index % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1'}`}>
                {/* Horizontal Connector Line for Desktop */}
                <div
                  className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-1 bg-border z-0 
                    ${index % 2 === 0
                      ? 'right-full w-[calc(theme(spacing.12)/2-theme(spacing.4)/2)]' // Card on right, line extends left from card into gap
                      : 'left-full w-[calc(theme(spacing.12)/2-theme(spacing.4)/2)]'   // Card on left, line extends right from card into gap
                    }`}
                  // spacing.12 is gap (3rem), spacing.4 is dot width (1rem)
                  // width is (gap/2 - dot_width/2) = (1.5rem - 0.5rem) = 1rem
                ></div>
                
                <Card className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">{edu.icon}</div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-foreground">{edu.institution}</CardTitle>
                      <CardDescription className="text-primary font-medium">{edu.degree}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pl-8 md:pl-14"> {/* Adjusted pl for card content consistency */}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4 mr-2 text-primary/80" />
                      {edu.dates}
                    </div>
                    <div className="flex items-start text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-2 mt-1 text-primary/80 flex-shrink-0" />
                      <span><strong>Focus:</strong> {edu.focus}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Central Dot for this row on Desktop, aligned with the main vertical timeline */}
              <div className="hidden md:block absolute left-1/2 top-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
              
              {/* Mobile: Dot and line (simplified) - if needed, or handled by card border */}
              <div className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 flex items-center">
                <div className="w-4 h-4 bg-primary rounded-full z-10"></div>
                <div className="w-4 h-1 bg-border ml-1"></div> {/* Small connector to card */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
