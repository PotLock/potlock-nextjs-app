import { ReactElement, useMemo } from "react";

import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { CAMPAIGNS_CONTRACT_ACCOUNT_ID, NETWORK } from "@/common/_config";
import { APP_METADATA } from "@/common/constants";
import type { Campaign as ContractCampaign } from "@/common/contracts/core/campaigns/interfaces";
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
    const rpcUrl =
      NETWORK === "mainnet" ? "https://free.rpc.fastnear.com" : "https://test.rpc.fastnear.com";

    const controller = new AbortController();
    const timeoutMs = 5000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let campaign: ContractCampaign | null | undefined;

    try {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: `campaign-${parsedCampaignId}`,
          method: "query",
          params: {
            request_type: "call_function",
            account_id: CAMPAIGNS_CONTRACT_ACCOUNT_ID,
            method_name: "get_campaign",
            args_base64: Buffer.from(
              JSON.stringify({ campaign_id: parsedCampaignId }),
            ).toString("base64"),
            finality: "optimistic",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`RPC response not ok: ${response.status}`);
      }

      const payload = (await response.json()) as {
        error?: { message?: string };
        result?: { result?: number[] };
      };

      if (payload.error?.message) {
        throw new Error(payload.error.message);
      }

      const resultBytes = payload.result?.result
        ? Uint8Array.from(payload.result.result)
        : undefined;

      if (!resultBytes) {
        throw new Error("RPC returned empty result");
      }

      campaign = JSON.parse(Buffer.from(resultBytes).toString()) as ContractCampaign;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!campaign) {
      return { notFound: true, revalidate: 60 };
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
    // Handle timeout or other errors by returning fallback SEO
    // This ensures the page doesn't break
    const message = (error as Error)?.message ?? "Unknown error";
    if (message.toLowerCase().includes("not found")) {
      return { notFound: true, revalidate: 60 };
    }

    console.error(`Error fetching campaign ${campaignId} for SEO:`, { message });

    return {
      props: {
        seo: defaultSeo,
        campaignId: parsedCampaignId,
      },
      revalidate: 60, // Try again sooner on error
    };
  }
};
