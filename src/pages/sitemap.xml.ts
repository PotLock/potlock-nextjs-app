import type { GetServerSideProps } from "next";

//! TODO: This should be updated when we move to main
const DEFAULT_SITE_URL = "https://app.potlock.org";
const STAGING_BASE_URL = process.env.NEXT_PUBLIC_INDEXER_API_URL || "https://dev.potlock.io/api/v1";

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = DEFAULT_SITE_URL.replace(/\/$/, "");

  type CampaignItem = {
    on_chain_id: number | string;
    updated_at?: string | null;
    end_at?: string | null;
  };
  type CampaignResp = { data?: CampaignItem[]; results?: CampaignItem[] };
  let campaignsResp: CampaignResp = {};

  try {
    try {
      campaignsResp = await fetchJson<CampaignResp>(`${STAGING_BASE_URL}/campaigns?page_size=150`);
    } catch {
      campaignsResp = {};
    }

    const nowIso = new Date().toISOString();

    const campaignsArray =
      (campaignsResp.data && Array.isArray(campaignsResp.data) && campaignsResp.data) ||
      (campaignsResp.results && Array.isArray(campaignsResp.results) && campaignsResp.results) ||
      [];

    const campaignUrls = campaignsArray.map((c) => ({
      loc: `${siteUrl}/campaign/${c.on_chain_id}`,
      lastmod: (c.updated_at || c.end_at || nowIso).slice(0, 10),
      changefreq: "daily",
      priority: "0.8",
    }));

    const homeUrl = {
      loc: siteUrl,
      lastmod: nowIso.slice(0, 10),
      changefreq: "daily",
      priority: "1.0",
    };

    const urls = [homeUrl, ...campaignUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    res.write(xml);
    res.end();
  } catch {
    const nowIso = new Date().toISOString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${nowIso.slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1200");
    res.end(xml);
  }

  return { props: {} };
};

export default function SiteMap() {
  return null;
}
