export interface SiteConfig {
  name: string;
  wordmark: string;
  role: {
    bold: string;
    light: string;
  };
  email: string;
  phone: string;
  location: string;
  url: string;
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
  };
}

export const site: SiteConfig = {
  name: 'Saumojyoti Chakraborty',
  wordmark: 'SAUMOJYOTI',
  role: {
    bold: 'AI & Robotics',
    light: 'Engineer',
  },
  email: 'chakraborty.saumojyoti@gmail.com',
  phone: 'Available upon request',
  location: 'Agartala, Tripura',
  url: 'https://portfolio1-saumojyoti-shivs-projects.vercel.app',
  socials: {
    github: 'https://github.com/Saumojyoti-Shiv',
    linkedin: 'https://www.linkedin.com/in/saumojyoti-chakraborty-412564278/',
    instagram: 'https://www.instagram.com/saumo_jyoti/',
  },
};
