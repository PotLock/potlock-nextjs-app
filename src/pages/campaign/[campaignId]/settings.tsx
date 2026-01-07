import { ReactElement } from "react";

import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { CampaignSettings } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";
import { RootLayout } from "@/layout/components/root-layout";

type SeoProps = {
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
};

export default function CampaignSettingsPage(props: SeoProps) {
  const router = useRouter();
  const { campaignId } = router.query as { campaignId: string };

  return (
    <RootLayout title={props.seoTitle} description={props.seoDescription} image={props.seoImage}>
      <CampaignSettings campaignId={parseInt(campaignId)} />
    </RootLayout>
  );
}

CampaignSettingsPage.getLayout = function getLayout(page: ReactElement) {
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

// Default SEO values (inline to avoid import issues in serverless)
const DEFAULT_SEO = {
  title: "Potlock | Fund Public Goods",
  description:
    "Discover and fund public goods projects on NEAR Protocol. Support open source, community initiatives, and impactful projects.",
  image: "https://app.potlock.org/assets/images/meta-image.png",
};

// Simple HTML strip function (inline to avoid import issues)
const stripHtmlTags = (html: string | undefined | null): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

// Generate campaign page data on-demand
export const getStaticProps: GetStaticProps<SeoProps> = async ({ params }) => {
  const campaignId = params?.campaignId as string;

  // Fallback props for any error case
  const fallbackProps = {
    props: {
      seoTitle: campaignId ? `Campaign ${campaignId}` : DEFAULT_SEO.title,
      seoDescription: DEFAULT_SEO.description,
      seoImage: DEFAULT_SEO.image,
    },
    revalidate: 60, // Retry sooner on error
  };

  if (!campaignId) {
    return { notFound: true };
  }

  try {
    // Use native fetch with AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `https://dev.potlock.io/api/v1/campaigns/${encodeURIComponent(campaignId)}`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    // If campaign not found, return 404
    if (res.status === 404) {
      return { notFound: true };
    }

    // For other errors, return fallback props (don't throw)
    if (!res.ok) {
      console.error(`Campaign API returned ${res.status} for campaign ${campaignId}`);
      return fallbackProps;
    }

    const campaign = await res.json();

    return {
      props: {
        seoTitle: campaign?.name || `Campaign ${campaignId}`,
        seoDescription: stripHtmlTags(campaign?.description) || DEFAULT_SEO.description,
        seoImage: campaign?.cover_image_url || DEFAULT_SEO.image,
      },
      revalidate: 120, // 2 minutes
    };
  } catch (error) {
    // Log but don't throw - return fallback props
    console.error(`Error fetching campaign ${campaignId}:`, error);
    return fallbackProps;
  }
};
