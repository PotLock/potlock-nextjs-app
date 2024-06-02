/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // allow external source without limiting it to specific domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
