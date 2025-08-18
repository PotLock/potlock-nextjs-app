import { ReactElement } from "react";

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { APP_METADATA } from "@/common/constants";
import { stripHtml } from "@/common/lib";
import { CampaignSettings, useCampaignCreateOrUpdateRedirect } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";
import { RootLayout } from "@/layout/components/root-layout";

type SeoProps = {
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
};

const Settings = (props: SeoProps) => {
  const router = useRouter();
  console.log(props);
  const { campaignId } = router.query as { campaignId: string };

  useCampaignCreateOrUpdateRedirect();

  return (
    <RootLayout title={props.seoTitle} description={props.seoDescription} image={props.seoImage}>
      <CampaignSettings campaignId={parseInt(campaignId)} />
    </RootLayout>
  );
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

export const getServerSideProps: GetServerSideProps<SeoProps> = async (ctx) => {
  try {
    const { campaignId } = ctx.params as { campaignId: string };

    const res = await fetch(
      `https://dev.potlock.io/api/v1/campaigns/${encodeURIComponent(campaignId)}`,
    );

    if (!res.ok) throw new Error(`Failed to fetch campaign: ${res.status}`);
    const campaign = await res.json();

    const seoTitle = campaign?.name ?? "Campaign";
    const seoDescription = stripHtml(campaign?.description) ?? "Support this campaign on Potlock.";
    const seoImage = campaign?.image ?? APP_METADATA.openGraph.images.url;
    // Intentionally do not pass a specific image to use the default OG image

    return { props: { seoTitle, seoDescription, seoImage } };
  } catch {
    return {
      props: {
        seoTitle: APP_METADATA.title,
        seoDescription: APP_METADATA.description,
      },
    };
  }
};

export default Settings;
