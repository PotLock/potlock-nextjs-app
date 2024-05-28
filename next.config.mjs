/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["ipfs.io", "arweave.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.near.social",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
