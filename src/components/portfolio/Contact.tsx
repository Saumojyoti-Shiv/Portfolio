import { Section } from './Section';
import ContactForm from './ContactForm';
import { MapPin, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Contact() {
  return (
    <Section id="contact" title="Get In Touch" animationType="fade-in-up">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground text-center md:text-left">
            I'm always excited to discuss new projects, creative ideas, or opportunities to collaborate. 
            Feel free to reach out!
          </p>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-card rounded-lg shadow-md hover:bg-card/70 transition-colors">
              <MapPin className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Location</h3>
                <p className="text-muted-foreground">Agartala, Tripura, India</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-card rounded-lg shadow-md hover:bg-card/70 transition-colors">
              <Mail className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <Link href="mailto:chakraborty.saumojyoti@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                  chakraborty.saumojyoti@gmail.com
                </Link>
              </div>
            </div>
             <div className="flex items-center p-4 bg-card rounded-lg shadow-md hover:bg-card/70 transition-colors">
              <Phone className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Phone</h3>
                <p className="text-muted-foreground">Available upon request</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}

