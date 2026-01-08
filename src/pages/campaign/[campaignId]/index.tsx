import { ReactElement, useMemo } from "react";

import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { APP_METADATA } from "@/common/constants";
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

// // Only pre-generate paths at build time - no API calls needed for ISR
// export const getStaticPaths: GetStaticPaths = async () => {
//   // Return empty paths - all campaign pages will be generated on-demand
//   // This avoids slow API calls during build and prevents timeouts
//   return {
//     paths: [],
//     fallback: "blocking",
//   };
// };

export const getStaticProps: GetStaticProps<SeoProps> = async ({ params }) => {
  const campaignId = params?.campaignId as string;

  if (!campaignId) {
    return { notFound: true };
  }

  // No server-side fetch to avoid serverless timeouts; client components load data
  return {
    props: {
      seoTitle: `Campaign ${campaignId} | Potlock`,
      seoDescription: APP_METADATA.description,
      seoImage: APP_METADATA.openGraph.images.url,
    },
    revalidate: 3600,
  };
};
