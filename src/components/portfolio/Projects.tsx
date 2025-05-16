
import { Section } from './Section';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink, Briefcase, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

const projectsData = [
  {
    title: 'Automated Farming System',
    description: 'An automated farming system using Arduino Uno connected to sensors (soil moisture, temperature, humidity) and a servo motor to monitor conditions and control irrigation, improving efficiency and reducing manual work.',
    techStack: ['Arduino Uno', 'C/C++', 'Sensors', 'Serial Communication'],
    githubLink: '#',
    liveLink: '#',
  },
  {
    title: 'Sun Tracking Solar Panel',
    description: "An Arduino-based system using LDRs and servo motors to automatically adjust a solar panel's position for maximum sunlight, boosting energy efficiency.",
    techStack: ['Arduino Uno', 'C/C++', 'LDR Sensors', 'Servo Motors', 'Serial Communication'],
    githubLink: '#',
    liveLink: null,
  },
  {
    title: 'Object Detection System',
    description: 'A real-time object detection system using YOLOv5, trained on a custom dataset for specific industrial applications.',
    techStack: ['PyTorch', 'OpenCV', 'YOLOv5', 'Docker'],
    githubLink: '#',
    liveLink: '#',
  },
  {
    title: 'Smart Dustbin',
    description: 'An advanced Arduino/IoT-based smart dustbin system controlled by voice commands via a smartphone app. It uses sensors to detect and automatically open the lid and can differentiate between biodegradable, non-biodegradable, and metal waste for efficient segregation and smart waste management.',
    techStack: ['Arduino Uno', 'Voice Control App', 'IoT Communication'],
    githubLink: '#',
    liveLink: null,
    videoLink: 'https://drive.google.com/file/d/10Kv3QyLTXGQHu-k9DiEcmVhCaEQiV7jU/view?usp=sharing',
  },
  {
    title: 'Automatic Street Light',
    description: 'An Arduino-based system using LDRs and IR sensors to automatically turn street lights ON at night and OFF during the day, and detect motion to save energy and reduce manual control.',
    techStack: ['Arduino Uno', 'Relay Module', 'Serial Communication'],
    githubLink: '#',
    liveLink: null,
  },
  {
    title: 'Drone Project',
    description: 'A quadcopter drone controlled by flight controllers, using sensors (gyroscope, accelerometer) for stable flight, remote control, and autonomous navigation in applications like surveillance and delivery.',
    techStack: ['Flight Controller', 'IMU Sensors', 'Remote Communication'],
    githubLink: '#',
    liveLink: null,
  },
];

export default function Projects() {
  return (
    <Section id="projects" title="Projects Showcase" animationType="fade-in-up">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((project, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-1 transition-all duration-300 hover:shadow-primary/20">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">{project.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {project.description}
              </CardDescription>
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Tech Stack:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="font-mono text-xs bg-secondary/70 text-secondary-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 flex justify-end space-x-3">
              {project.githubLink && project.githubLink !== '#' && (
                <Link href={project.githubLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} GitHub repository`}>
                  <Button variant="outline" size="icon" className="hover:text-primary hover:border-primary transition-colors">
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              {project.liveLink && project.liveLink !== '#' && (
                <Link href={project.liveLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} live demo`}>
                  <Button variant="default" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              {project.videoLink && project.videoLink !== '#' && (
                <Link href={project.videoLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} video demo`}>
                  <Button variant="outline" size="icon" className="hover:text-primary hover:border-primary transition-colors">
                    <Video className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  );
}
