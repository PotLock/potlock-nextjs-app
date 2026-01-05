import { ReactElement } from "react";

import type { GetServerSideProps } from "next";

import { CampaignDonorsTable } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";
import { RootLayout } from "@/layout/components/root-layout";

type PageProps = {
  campaignId: number;
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
};

export default function CampaignLeaderboardPage(props: PageProps) {
  return (
    <RootLayout title={props.seoTitle} description={props.seoDescription} image={props.seoImage}>
      <CampaignDonorsTable campaignId={props.campaignId} />
    </RootLayout>
  );
}

CampaignLeaderboardPage.getLayout = function getLayout(page: ReactElement) {
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

// SSR - fetch campaign data on every request
export const getServerSideProps: GetServerSideProps<PageProps> = async ({ params, res }) => {
  const campaignId = params?.campaignId as string;

  if (!campaignId || isNaN(Number(campaignId))) {
    return { notFound: true };
  }

  const numericCampaignId = parseInt(campaignId, 10);

  // Set cache headers - cache for 5 minutes, stale-while-revalidate for 10 minutes
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=600"
  );

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

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
    };
  }
};
