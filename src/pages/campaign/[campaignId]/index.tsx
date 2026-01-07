import { ReactElement } from "react";

import type { GetStaticPaths, GetStaticProps } from "next";

import { CampaignLayout } from "@/layout/campaign/components/layout";
import { RootLayout } from "@/layout/components/root-layout";

type PageProps = {
  campaignId: number;
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
};

export default function CampaignPage(props: PageProps) {
  // Content is rendered by CampaignLayout based on tab query param
  // This component just provides the SEO wrapper
  return (
    <RootLayout title={props.seoTitle} description={props.seoDescription} image={props.seoImage}>
      {/* Content rendered by CampaignLayout */}
      <></>
    </RootLayout>
  );
}

CampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

// Default SEO values
const DEFAULT_SEO = {
  title: "Potlock | Fund Public Goods",
  description:
    "Discover and fund public goods projects on NEAR Protocol. Support open source, community initiatives, and impactful projects.",
  image: "https://app.potlock.org/assets/images/meta-image.png",
};

// Simple HTML strip function
const stripHtmlTags = (html: string | undefined | null): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

// ISR: No build-time pre-generation to prevent timeouts
// All pages generated on-demand when first requested, then cached
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // No pre-generation at build time
    fallback: "blocking", // Generate on first visit, then cache with ISR
  };
};

// ISR: Fetch campiagn data and cache with 2-minute revalidation
export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const campaignId = params?.campaignId as string;

  if (!campaignId || isNaN(Number(campaignId))) {
    return { notFound: true };
  }

  const numericCampaignId = parseInt(campaignId, 10);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      `https://dev.potlock.io/api/v1/campaigns/${encodeURIComponent(campaignId)}`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (response.status === 404) {
      return { notFound: true };
    }

    if (!response.ok) {
      return {
        props: {
          campaignId: numericCampaignId,
          seoTitle: `Campaign`,
          seoDescription: DEFAULT_SEO.description,
          seoImage: DEFAULT_SEO.image,
        },
        revalidate: 60, // Retry sooner on error
      };
    }

    const campaign = await response.json();

    return {
      props: {
        campaignId: numericCampaignId,
        seoTitle: campaign?.name || `Campaign`,
        seoDescription: stripHtmlTags(campaign?.description) || DEFAULT_SEO.description,
        seoImage: campaign?.cover_image_url || DEFAULT_SEO.image,
      },
      revalidate: 120, // Revalidate every 2 minutes
    };
  } catch (error) {
    console.error(`Error fetching campaign ${campaignId}:`, error);

    return {
      props: {
        campaignId: numericCampaignId,
        seoTitle: `Campaign`,
        seoDescription: DEFAULT_SEO.description,
        seoImage: DEFAULT_SEO.image,
      },
      revalidate: 60, // Retry sooner on error
    };
  }
};
