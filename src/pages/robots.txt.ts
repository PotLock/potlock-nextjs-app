import type { GetServerSideProps } from "next";

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://staging.alpha.potlock.org";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers.host || DEFAULT_SITE_URL.replace(/^https?:\/\//, "");
  const primary = `${proto}://${host}`.replace(/\/$/, "");

  // Hardcoded alternate domains
  const hardcodedAlternates = [
    "https://staging.alpha.potlock.io",
    "https://staging.alpha.potlock.xyz",
  ];

  const bases = Array.from(
    new Set([primary, ...hardcodedAlternates.map((u) => u.replace(/\/$/, ""))]),
  );

  const sitemapLines = bases.map((base) => `Sitemap: ${base}/sitemap.xml`).join("\n");

  const robots = `User-agent: *
Allow: /

${sitemapLines}
`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
  res.write(robots);
  res.end();

  return { props: {} };
};

export default function RobotsTxt() {
  return null;
}
