import type { Metadata } from 'next';
import { Inter, Open_Sans, Fira_Code } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/portfolio/Header';
import Footer from '@/components/portfolio/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '700'],
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Saumojyoti Chakraborty's Portfolio",
  description: 'Portfolio of Saumojyoti, showcasing skills and projects in AI, ML, and Robotics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body 
        className={`${inter.variable} ${openSans.variable} ${firaCode.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
