
"use client";

import { useState, useRef, type FormEvent } from 'react';
import emailjs from 'emailjs-com';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SendHorizonal, Loader2, User, Mail as MailIcon, MessageSquare } from 'lucide-react';

const SERVICE_ID = 'service_m8441bl';
const TEMPLATE_ID = 'template_qjeip8e';
const PUBLIC_KEY = 'BvP2QyAKJ3YuRP4YO';

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all transform hover:scale-105">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          Send Message <SendHorizonal className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    setIsLoading(true);

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((result) => {
        toast({
          title: 'Message Sent!',
          description: "Thank you for your message! I'll get back to you soon.",
          variant: 'default',
        });
        formRef.current?.reset();
      }, (error) => {
        toast({
          title: 'Error Sending Message',
          description: error.text || 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div>
        <Label htmlFor="name" className="mb-2 block text-sm font-medium text-muted-foreground">Your Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="text" id="name" name="name" placeholder="John Doe" required className="pl-10 py-3 bg-card border-border focus:border-primary focus:ring-primary" />
        </div>
      </div>
      <div>
        <Label htmlFor="email" className="mb-2 block text-sm font-medium text-muted-foreground">Your Email</Label>
        <div className="relative">
          <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="email" id="email" name="email" placeholder="you@example.com" required className="pl-10 py-3 bg-card border-border focus:border-primary focus:ring-primary" />
        </div>
      </div>
      <div>
        <Label htmlFor="message" className="mb-2 block text-sm font-medium text-muted-foreground">Your Message</Label>
        <div className="relative">
           <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
          <Textarea id="message" name="message" rows={5} placeholder="How can I help you?" required className="pl-10 py-3 bg-card border-border focus:border-primary focus:ring-primary min-h-[120px]" />
        </div>
      </div>
      <SubmitButton isLoading={isLoading} />
    </form>
  );
}
