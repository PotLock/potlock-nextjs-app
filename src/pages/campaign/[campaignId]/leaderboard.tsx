import { ReactElement } from "react";

import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { APP_METADATA } from "@/common/constants";
import { stripHtml } from "@/common/lib/datetime";
import { fetchWithTimeout } from "@/common/lib/fetch-with-timeout";
import { CampaignDonorsTable } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";
import { RootLayout } from "@/layout/components/root-layout";

type SeoProps = {
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
};

export default function CampaignLeaderboardPage(props: SeoProps) {
  const router = useRouter();
  const { campaignId } = router.query as { campaignId: string };

  return (
    <RootLayout title={props.seoTitle} description={props.seoDescription} image={props.seoImage}>
      <CampaignDonorsTable campaignId={parseInt(campaignId)} />
    </RootLayout>
  );
}

CampaignLeaderboardPage.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

// Don't pre-generate any paths at build time - generate on-demand to avoid timeouts
export const getStaticPaths: GetStaticPaths = async () => {
  // Return empty paths - all pages will be generated on first request
  // This prevents build timeouts and serverless function timeouts
  return {
    paths: [],
    fallback: "blocking", // Generate pages on-demand when first visited, then cache
  };
};

// Pre-build each campaign page with its data
export const getStaticProps: GetStaticProps<SeoProps> = async ({ params }) => {
  try {
    const campaignId = params?.campaignId as string;

    if (!campaignId) {
      return {
        notFound: true,
      };
    }

    // Fetch with timeout to prevent server timeouts
    const res = await fetchWithTimeout(
      `https://dev.potlock.io/api/v1/campaigns/${encodeURIComponent(campaignId)}`,
      {},
      8000, // 8 second timeout
    );

    if (!res.ok) {
      // If campaign not found, return 404 instead of erroring
      if (res.status === 404) {
        return {
          notFound: true,
        };
      }

      throw new Error(`Failed to fetch campaign: ${res.status}`);
    }

    let campaign;

    try {
      campaign = await res.json();
    } catch (jsonError) {
      console.error("Error parsing campaign JSON:", jsonError);
      throw new Error("Invalid campaign data format");
    }

    const seoTitle = campaign?.name ?? `Campaign ${campaignId}`;

    const seoDescription = stripHtml(campaign?.description) ?? "Support this campaign on Potlock.";

    // Use cover_image_url field which is the correct field for campaign images
    const seoImage = campaign?.cover_image_url ?? APP_METADATA.openGraph.images.url;

    return {
      props: { seoTitle, seoDescription, seoImage },
      // Revalidate every 2 minutes (120 seconds) to keep data fresh
      revalidate: 120,
    };
  } catch (error) {
    console.error("Error generating static props:", error);

    // Return fallback props instead of throwing error to prevent 500
    // This allows the page to render with default SEO data
    return {
      props: {
        seoTitle: `Campaign ${params?.campaignId || ""}`,
        seoDescription: APP_METADATA.description,
        seoImage: APP_METADATA.openGraph.images.url,
      },
      // Shorter revalidate for error cases to retry sooner
      revalidate: 60,
    };
  }
};
