/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.near.social',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
