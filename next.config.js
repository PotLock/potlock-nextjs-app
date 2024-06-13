import UnoCSS from "@unocss/webpack";

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

  webpack: ({ plugins, ...config }) => ({
    ...config,
    // Required for HMR support for UnoCSS
    cache: false,
    plugins: [...plugins, UnoCSS()],
  }),
};

export default nextConfig;
