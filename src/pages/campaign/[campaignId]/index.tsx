import { ReactElement, useMemo } from "react";

import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { APP_METADATA } from "@/common/constants";
import { stripHtml } from "@/common/lib/datetime";
import { fetchWithTimeout } from "@/common/lib/fetch-with-timeout";
import { CampaignDonorsTable, CampaignSettings } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";
import { RootLayout } from "@/layout/components/root-layout";

type SeoProps = {
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
};

export default function CampaignPage(props: SeoProps) {
  const router = useRouter();
  const { campaignId, tab } = router.query as { campaignId: string; tab?: string };

  const parsedCampaignId = parseInt(campaignId);

  // Determine which content to show based on tab param
  const content = useMemo(() => {
    switch (tab) {
      case "settings":
        return <CampaignSettings campaignId={parsedCampaignId} />;
      case "leaderboard":
      default:
        return <CampaignDonorsTable campaignId={parsedCampaignId} />;
    }
  }, [tab, parsedCampaignId]);

  return (
    <RootLayout title={props.seoTitle} description={props.seoDescription} image={props.seoImage}>
      {content}
    </RootLayout>
  );
}

CampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

// Only pre-generate paths at build time - no API calls needed for ISR
export const getStaticPaths: GetStaticPaths = async () => {
  // Return empty paths - all campaign pages will be generated on-demand
  // This avoids slow API calls during build and prevents timeouts
  return {
    paths: [],
    fallback: "blocking",
  };
};

// Fetch campaign SEO data with short timeout to prevent Vercel function timeouts
export const getStaticProps: GetStaticProps<SeoProps> = async ({ params }) => {
  const campaignId = params?.campaignId as string;

  if (!campaignId) {
    return { notFound: true };
  }

  // Default fallback props
  const fallbackProps: SeoProps = {
    seoTitle: `Campaign ${campaignId} | Potlock`,
    seoDescription: APP_METADATA.description,
    seoImage: APP_METADATA.openGraph.images.url,
  };

  try {
    // Short timeout (3s) to prevent Vercel serverless function timeouts
    // If API is slow, we fall back to generic SEO and let client fetch the data
    const res = await fetchWithTimeout(
      `https://dev.potlock.io/api/v1/campaigns/${encodeURIComponent(campaignId)}`,
      {},
      8000,
    );

    if (!res.ok) {
      // Return fallback for any non-OK response
      return {
        props: fallbackProps,
        revalidate: 60, // Retry sooner on error
      };
    }

    const campaign = await res.json();

    return {
      props: {
        seoTitle: campaign?.name ? `${campaign.name} | Potlock` : fallbackProps.seoTitle,
        seoDescription: stripHtml(campaign?.description) || fallbackProps.seoDescription,
        seoImage: campaign?.cover_image_url || fallbackProps.seoImage,
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch {
    // Timeout or network error - return fallback props
    return {
      props: fallbackProps,
      revalidate: 60, // Retry sooner on error
    };
  }
};
