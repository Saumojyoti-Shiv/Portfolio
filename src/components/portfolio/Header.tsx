
"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    // Set initial state
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={cn(
      "fixed top-4 left-4 right-4 z-50 transition-all duration-300 ease-in-out",
      "rounded-xl shadow-lg", // Always rounded and shadowed for "floating" effect
      isScrolled ? "bg-card/90 backdrop-blur-md" : "bg-card/70 backdrop-blur-sm" // Adjust background and blur based on scroll
    )}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6"> {/* Adjusted padding */}
        <div className="flex items-center justify-between h-14 md:h-18"> {/* Adjusted height */}
          <Link href="/" className="text-xl md:text-2xl font-bold font-heading text-primary hover:text-primary/80 transition-colors">
            Saumojyoti Chakraborty
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium px-3 py-2 rounded-md text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card shadow-xl py-3 mt-2 rounded-b-xl"> {/* Adjusted py slightly if needed */}
          <nav className="flex flex-col items-center space-y-1"> {/* Adjusted space-y slightly */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
                className="text-foreground hover:text-primary transition-colors font-medium text-base px-3 py-2 rounded-md w-full text-center"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

