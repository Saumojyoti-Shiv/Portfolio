import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    buildActivity: false,
  },
  allowedDevOrigins: ['6000-firebase-studio-1747042376980.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev', '9000-firebase-studio-1747042376980.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev']
};

export default nextConfig;
