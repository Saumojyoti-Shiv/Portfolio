"use client";
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionAnimatorProps = {
  children: ReactNode;
  className?: string;
  animationClass?: string; // e.g., 'animate-fade-in', 'animate-slide-in-left'
  delay?: string; // Tailwind delay class e.g., 'delay-200'
  threshold?: number;
  once?: boolean; // Whether to animate only once
};

export function SectionAnimator({
  children,
  className,
  animationClass = 'animate-fade-in',
  delay = '',
  threshold = 0.1,
  once = true,
}: SectionAnimatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
           // Optionally reset animation if it should replay when scrolling out and back in
           // setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity duration-500', // Base class for smooth opacity, animation handles transform
        isVisible ? `${animationClass} ${delay} opacity-100` : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
}
