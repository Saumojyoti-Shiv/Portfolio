import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import { SectionAnimator } from './SectionAnimator';

type SectionProps = PropsWithChildren<{
  id: string;
  className?: string;
  title?: string;
  titleClassName?: string;
  animate?: boolean;
  animationType?: 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'fade-in-up';
  animationDelay?: string; // Tailwind delay class e.g., 'delay-200'
}>;

export function Section({
  id,
  children,
  className,
  title,
  titleClassName,
  animate = true,
  animationType = 'fade-in-up',
  animationDelay = '',
}: SectionProps) {
  
  const animationClassMap = {
    'fade-in': 'animate-fade-in',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
    'fade-in-up': 'animate-fade-in-up',
  };

  const content = (
    <section id={id} className={cn('py-16 md:py-20 overflow-hidden', className)}> {/* Added overflow-hidden for slide animations */}
      <div className="container">
        {title && (
          <h2 className={cn('text-3xl md:text-4xl font-bold font-heading mb-10 md:mb-16 text-center text-foreground', titleClassName)}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );

  if (animate) {
    return (
      <SectionAnimator
        animationClass={animationClassMap[animationType]}
        delay={animationDelay}
      >
        {content}
      </SectionAnimator>
    );
  }
  return content;
}
