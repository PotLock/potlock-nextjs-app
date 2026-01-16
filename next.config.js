/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: "loose",
  },
  transpilePackages: [
    "@near-wallet-selector/core",
    "@near-wallet-selector/bitget-wallet",
    "@near-wallet-selector/bitte-wallet",
    "@near-wallet-selector/coin98-wallet",
    "@near-wallet-selector/ethereum-wallets",
    "@near-wallet-selector/here-wallet",
    "@near-wallet-selector/hot-wallet",
    "@near-wallet-selector/intear-wallet",
    "@near-wallet-selector/ledger",
    "@near-wallet-selector/math-wallet",
    "@near-wallet-selector/meteor-wallet",
    "@near-wallet-selector/mintbase-wallet",
    "@near-wallet-selector/my-near-wallet",
    "@near-wallet-selector/nightly",
    "@near-wallet-selector/ramper-wallet",
    "@near-wallet-selector/sender",
    "@near-wallet-selector/unity-wallet",
    "@near-wallet-selector/welldone-wallet",
    "@near-wallet-selector/wallet-connect",
    "@near-wallet-selector/xdefi",
    "@meteorwallet/sdk",
    "nanoid",
    "@walletconnect/modal",
    "@walletconnect/modal-ui",
  ],

  async redirects() {
    return [
      {
        source: "/((?!_next).*)js",
        destination: "/404",
        permanent: false,
      },
      // Redirect old campaign subroutes to new tab-based routes
      {
        source: "/campaign/:campaignId/leaderboard",
        destination: "/campaign/:campaignId?tab=leaderboard",
        permanent: true,
      },
      {
        source: "/campaign/:campaignId/settings",
        destination: "/campaign/:campaignId?tab=settings",
        permanent: true,
      },
    ];
  },

  images: {
    // allow external source without limiting it to specific domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.(".svg"));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },

      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
