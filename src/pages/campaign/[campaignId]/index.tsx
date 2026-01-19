import { ReactElement, useMemo } from "react";

import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { INDEXER_API_ENDPOINT_URL } from "@/common/_config";
import { APP_METADATA } from "@/common/constants";
import { CampaignDonorsTable, CampaignSettings } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";
import { RootLayout } from "@/layout/components/root-layout";

type SeoProps = {
  title: string;
  description: string;
  image?: string;
};

type CampaignPageProps = {
  seo: SeoProps;
};

export default function CampaignPage({ seo }: CampaignPageProps) {
  const router = useRouter();
  const { tab, campaignId } = router.query as { tab?: string; campaignId?: string };

  const parsedCampaignId = campaignId ? parseInt(campaignId) : undefined;

  // Determine which content to show based on tab param
  const content = useMemo(() => {
    if (!parsedCampaignId || Number.isNaN(parsedCampaignId)) {
      return null;
    }

    switch (tab) {
      case "settings":
        return <CampaignSettings campaignId={parsedCampaignId} />;
      case "leaderboard":
      default:
        return <CampaignDonorsTable campaignId={parsedCampaignId} />;
    }
  }, [tab, parsedCampaignId]);

  return (
    <RootLayout
      title={seo.title}
      description={seo.description}
      image={seo.image}
    >
      {content}
    </RootLayout>
  );
}

CampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

export const getServerSideProps: GetServerSideProps<CampaignPageProps> = async (context) => {
  const { campaignId } = context.params as { campaignId?: string };
  const parsedCampaignId = campaignId ? parseInt(campaignId) : undefined;

  const fallbackSeo: SeoProps = {
    title: parsedCampaignId ? `Campaign ${parsedCampaignId}` : APP_METADATA.title,
    description: APP_METADATA.description,
    image: APP_METADATA.openGraph.images.url,
  };

  if (!parsedCampaignId || Number.isNaN(parsedCampaignId)) {
    return { props: { seo: fallbackSeo } };
  }

  const timeoutMs = 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`https://dev.potlock.io/api/v1/campaigns/${parsedCampaignId}`, {
      headers: { "content-type": "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      return { props: { seo: fallbackSeo } };
    }

    const campaign = (await response.json()) as {
      name?: string | null;
      description?: string | null;
      cover_image_url?: string | null;
    };

    const seo: SeoProps = {
      title: campaign?.name ? `${campaign.name}` : fallbackSeo.title,
      description:
        campaign?.description && campaign.description.trim()
          ? campaign.description.substring(0, 160)
          : fallbackSeo.description,
      image: campaign?.cover_image_url ?? fallbackSeo.image,
    };

    return { props: { seo } };
  } catch {
    return { props: { seo: fallbackSeo } };
  } finally {
    clearTimeout(timeoutId);
  }
};
