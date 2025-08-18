import { ReactElement } from "react";

import type { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";

import { CampaignSettings } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";
import { APP_METADATA } from "@/common/constants";
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

// Pre-generate the most popular campaigns at build time
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Fetch campaigns to get IDs for pre-generation
    const res = await fetch("https://dev.potlock.io/api/v1/campaigns?limit=100");
    if (!res.ok) throw new Error(`Failed to fetch campaigns: ${res.status}`);
    const campaigns = await res.json();
    
    // Generate paths for the first 50 campaigns (most recent/active)
    const paths = campaigns.data?.map((campaign: any) => ({
      params: { campaignId: campaign.on_chain_id.toString() },
    })) || [];

    return {
      paths,
      fallback: "blocking", // Generate new pages on-demand if not pre-built
    };
  } catch (error) {
    console.error("Error generating static paths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

// Pre-build each campaign page with its data
export const getStaticProps: GetStaticProps<SeoProps> = async ({ params }) => {
  try {
    const campaignId = params?.campaignId as string;
    
    const res = await fetch(`https://dev.potlock.io/api/v1/campaigns/${encodeURIComponent(campaignId)}`);
    if (!res.ok) throw new Error(`Failed to fetch campaign: ${res.status}`);
    const campaign = await res.json();

    const seoTitle = campaign?.name ?? "Campaign";
    const seoDescription = campaign?.description ?? "Support this campaign on Potlock.";
    const seoImage = campaign?.image ?? APP_METADATA.openGraph.images.url;

    return {
      props: { seoTitle, seoDescription, seoImage },
      // Revalidate every 5 minutes (300 seconds) to keep data fresh
      revalidate: 300,
    };
  } catch (error) {
    console.error("Error generating static props:", error);
    return {
      props: {
        seoTitle: APP_METADATA.title,
        seoDescription: APP_METADATA.description,
        seoImage: APP_METADATA.openGraph.images.url,
      },
      revalidate: 300,
    };
  }
};
