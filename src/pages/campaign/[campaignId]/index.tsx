import { ReactElement, useMemo } from "react";

import type { AxiosError } from "axios";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { v1CampaignsRetrieve2 } from "@/common/api/indexer/internal/client.generated";
import type { Campaign } from "@/common/api/indexer/internal/client.generated";
import {
  INDEXER_CLIENT_CONFIG,
  INDEXER_CLIENT_CONFIG_STAGING,
} from "@/common/api/indexer/internal/config";
import { APP_METADATA } from "@/common/constants";
import { CampaignDonorsTable, CampaignSettings } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";
import { RootLayout } from "@/layout/components/root-layout";

type SeoProps = {
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
};

type CampaignPageProps = {
  seo: SeoProps;
  campaignId: number;
};

export default function CampaignPage({ seo, campaignId }: CampaignPageProps) {
  const router = useRouter();
  const { tab } = router.query as { tab?: string };

  const parsedCampaignId = campaignId;

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
    <RootLayout title={seo.seoTitle} description={seo.seoDescription} image={seo.seoImage}>
      {content}
    </RootLayout>
  );
}

CampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<CampaignPageProps> = async (context) => {
  const { campaignId } = context.params as { campaignId: string };

  const parsedCampaignId = parseInt(campaignId);

  if (Number.isNaN(parsedCampaignId) || parsedCampaignId <= 0) {
    return {
      notFound: true,
    };
  }

  // Fallback SEO in case of error
  const defaultSeo: SeoProps = {
    seoTitle: `Campaign ${campaignId} | Potlock`,
    seoDescription: APP_METADATA.description,
    seoImage: APP_METADATA.openGraph.images.url,
  };

  try {
    const apiConfig =
      process.env.NEXT_PUBLIC_ENV === "test"
        ? INDEXER_CLIENT_CONFIG
        : INDEXER_CLIENT_CONFIG_STAGING;

    const baseURL = apiConfig.axios.baseURL;

    const response = await v1CampaignsRetrieve2(parsedCampaignId, {
      baseURL,
      timeout: 5000, // 5 seconds timeout
    });

    const campaign = response.data;

    if (!campaign) {
      return {
        props: {
          seo: defaultSeo,
          campaignId: parsedCampaignId,
        },
        revalidate: 60,
      };
    }

    const seo: SeoProps = {
      seoTitle: `${campaign.name} | Potlock`,
      seoDescription:
        campaign.description && campaign.description.trim()
          ? campaign.description.substring(0, 160)
          : APP_METADATA.description,
      seoImage: campaign.cover_image_url ?? APP_METADATA.openGraph.images.url,
    };

    return {
      props: {
        seo,
        campaignId: parsedCampaignId,
      },
      revalidate: 300, // 5 minutes
    };
  } catch (error) {
    const axiosError = error as AxiosError;

    // Handle 404 specifically
    if (axiosError.response?.status === 404) {
      return {
        notFound: true,
      };
    }

    // Handle timeout or other errors by returning fallback SEO
    // This ensures the page doesn't break
    console.error(`Error fetching campaign ${campaignId} for SEO:`, axiosError.message);

    return {
      props: {
        seo: defaultSeo,
        campaignId: parsedCampaignId,
      },
      revalidate: 60, // Try again sooner on error
    };
  }
};
