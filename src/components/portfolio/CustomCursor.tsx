
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  
  // Start off-screen to prevent flash at (0,0)
  const [position, setPosition] = useState({ x: -100, y: -100 }); 
  // Cursor is visible by default if mouse is in window
  const [isVisible, setIsVisible] = useState(true); 
  const [isClicked, setIsClicked] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  const updatePointerState = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const interactiveElements = [
      'A', 
      'BUTTON', 
      'INPUT', 
      'TEXTAREA', 
      'SELECT', 
      '[role="button"]', 
      '[tabindex]:not([tabindex="-1"])',
      'IMG' // Added IMG to interactive elements
    ];
    const isInteractive = interactiveElements.some(selector => target.closest(selector));
    setIsHoveringInteractive(isInteractive);
  }, []);

  const animateCursor = useCallback((event: MouseEvent) => {
    setPosition({ x: event.clientX, y: event.clientY });
    updatePointerState(event);
  }, [updatePointerState]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      requestRef.current = requestAnimationFrame(() => animateCursor(event));
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    
    // Use document.documentElement for mouseenter/mouseleave to cover the whole viewport
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.documentElement.classList.add('cursor-none');
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.documentElement.classList.remove('cursor-none');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animateCursor]);

  return (
    <div
      ref={cursorRef}
      className={cn(
        'custom-cursor',
        { 'hovered': isHoveringInteractive && !isClicked },
        { 'clicked': isClicked }
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: isVisible ? 1 : 0, // Control visibility via opacity
      }}
    />
  );
}
