
import { Section } from './Section';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Award, CalendarDays, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const certificationsData = [
  {
    name: 'Machine Learning with Python',
    issuer: 'Coursera',
    date: 'Issued Dec 2024',
    icon: <Award className="h-10 w-10 text-destructive" />,
    url: 'https://www.coursera.org/account/accomplishments/verify/IKCUMNNX4QZF', 
    verified: true,
    skillsCovered: ['Machine Learning', 'Python'],
  },
  {
    name: 'Prompt Design in Vertex AI',
    issuer: 'Google',
    date: 'Issued May 2025',
    icon: <Award className="h-10 w-10 text-destructive" />,
    url: 'https://www.cloudskillsboost.google/public_profiles/f07f692d-9ae0-4155-a4fc-c803d1958f67/badges/15460292?utm_medium=social&utm_source=linkedin&utm_campaign=ql-social-share',
    verified: true,
    skillsCovered: ['Artificial Intelligence (AI)'],
  },
  {
    name: 'Inspect Rich Documents with Gemini Multimodality and Multimodal RAG',
    issuer: 'Google',
    date: 'Issued May 2025',
    icon: <Award className="h-10 w-10 text-destructive" />,
    url: '#', 
    verified: true, 
    skillsCovered: ['Multimodal AI', 'RAG'],
  },
  {
    name: 'Develop GenAI Apps with Gemini and Streamlit',
    issuer: 'Google',
    date: 'Issued May 2025',
    icon: <Award className="h-10 w-10 text-destructive" />,
    url: '#',
    verified: true,
    skillsCovered: ['GenAI App Development', 'Streamlit UI Design', 'AI App Prototyping'],
  },
  {
    name: 'Build Real World AI Applications with Gemini and Imagen',
    issuer: 'Google',
    date: 'Issued May 2025',
    icon: <Award className="h-10 w-10 text-destructive" />,
    url: 'https://www.cloudskillsboost.google/public_profiles/f07f692d-9ae0-4155-a4fc-c803d1958f67/badges/15724038',
    verified: true,
    skillsCovered: ['Real-World AI Applications', 'Text-to-Image Generation', 'AI App Deployment'],
  },
  {
    name: 'Explore Generative AI with the Gemini API in Vertex AI',
    issuer: 'Google',
    date: 'Issued May 2025',
    icon: <Award className="h-10 w-10 text-destructive" />,
    url: '#', 
    verified: true,
    skillsCovered: ['Gemini API Integration', 'Prompt Engineering', 'Vertex AI Usage'],
  },
];

export default function Certifications() {
  return (
    <Section id="certifications" title="Certifications & Credentials" animationType="fade-in-up">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificationsData.map((cert, index) => {
          const cardContent = (
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-destructive/30 transition-all duration-300 flex flex-col group transform hover:-translate-y-1 h-full">
              <CardHeader className="flex flex-row items-start space-x-4 pb-3">
                <div className="p-2 bg-destructive/10 rounded-lg mt-1">
                  {cert.icon}
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-destructive transition-colors">{cert.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{cert.issuer}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="h-4 w-4 mr-2 text-destructive/80" />
                  {cert.date}
                </div>
                {cert.skillsCovered && cert.skillsCovered.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">Skills Covered:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skillsCovered.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs bg-secondary/70 text-secondary-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-3 justify-between items-center">
                {cert.verified ? (
                  <Badge variant="default" className="bg-destructive text-destructive-foreground">
                    <CheckCircle2 className="h-3 w-3 mr-1.5" /> Verified
                  </Badge>
                ) : (
                   <Badge variant="secondary">Pending Verification</Badge>
                )}
                {cert.url && cert.url !== '#' && (
                   <div className="text-xs text-primary hover:underline flex items-center" aria-label="View Credential">
                  </div>
                )}
              </CardFooter>
            </Card>
          );

          if (cert.url && cert.url !== '#') {
            return (
              <Link key={index} href={cert.url} target="_blank" rel="noopener noreferrer" className="block h-full" aria-label={`View credential for ${cert.name}`}>
                {cardContent}
              </Link>
            );
          }
          
          return <div key={index} className="h-full">{cardContent}</div>;
        })}
      </div>
    </Section>
  );
}

