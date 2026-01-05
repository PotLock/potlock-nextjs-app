import { ReactElement } from "react";

import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { APP_METADATA } from "@/common/constants";
import { stripHtml } from "@/common/lib/datetime";
import { fetchWithTimeout } from "@/common/lib/fetch-with-timeout";
import { CampaignDonorsTable } from "@/entities/campaign";
import { CampaignLayout } from "@/layout/campaign/components/layout";
import { RootLayout } from "@/layout/components/root-layout";

type SeoProps = {
  seoTitle: string;
  seoDescription: string;
  seoImage?: string;
};

export default function CampaignLeaderboardPage(props: SeoProps) {
  const router = useRouter();
  const { campaignId } = router.query as { campaignId: string };

  return (
    <RootLayout title={props.seoTitle} description={props.seoDescription} image={props.seoImage}>
      <CampaignDonorsTable campaignId={parseInt(campaignId)} />
    </RootLayout>
  );
}

CampaignLeaderboardPage.getLayout = function getLayout(page: ReactElement) {
  return <CampaignLayout>{page}</CampaignLayout>;
};

// Pre-generate the most popular campaigns at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // COMMENTED OUT: Build-time API fetch causes timeouts in CI/CD environments
  // The API calls during build can exceed Next.js's 60-second static worker timeout,
  // causing the build to fail and set fallback: null, which results in 404s for campaigns.
  // Solution: Skip pre-generation and rely entirely on on-demand generation with ISR.
  // Pages will be generated on first request and cached for 5 minutes (see revalidate in getStaticProps).

  // try {
  //   // Fetch campaigns to get IDs for pre-generation with timeout
  //   const res = await fetchWithTimeout(
  //     "https://dev.potlock.io/api/v1/campaigns?limit=50",
  //     {},
  //     8000, // 8 second timeout
  //   );

  //   if (!res.ok) throw new Error(`Failed to fetch campaigns: ${res.status}`);
  //   const campaigns = await res.json();

  //   // Generate paths for the first 50 campaigns (most recent/active)
  //   const paths =
  //     campaigns.data?.map((campaign: any) => ({
  //       params: { campaignId: campaign.on_chain_id.toString() },
  //     })) || [];

  //   return {
  //     paths,
  //     fallback: "blocking", // Generate new pages on-demand if not pre-built
  //   };
  // } catch (error) {
  //   console.error("Error generating static paths:", error);
  //   // Return empty paths but still allow blocking fallback for on-demand generation
  //   return {
  //     paths: [],
  //     fallback: "blocking",
  //   };
  // }

  // Generate pages on-demand when first requested, then cache with ISR
  return {
    paths: [],
    fallback: "blocking", // Generate new pages on-demand if not pre-built
  };
};

// Pre-build each campaign page with its data
export const getStaticProps: GetStaticProps<SeoProps> = async ({ params }) => {
  try {
    const campaignId = params?.campaignId as string;

    if (!campaignId) {
      return {
        notFound: true,
      };
    }

    // Fetch with timeout to prevent server timeouts
    const res = await fetchWithTimeout(
      `https://dev.potlock.io/api/v1/campaigns/${encodeURIComponent(campaignId)}`,
      {},
      8000, // 8 second timeout
    );

    if (!res.ok) {
      // If campaign not found, return 404 instead of erroring
      if (res.status === 404) {
        return {
          notFound: true,
        };
      }

      throw new Error(`Failed to fetch campaign: ${res.status}`);
    }

    let campaign;

    try {
      campaign = await res.json();
    } catch (jsonError) {
      console.error("Error parsing campaign JSON:", jsonError);
      throw new Error("Invalid campaign data format");
    }

    const seoTitle = campaign?.name ?? `Campaign ${campaignId}`;

    const seoDescription = stripHtml(campaign?.description) ?? "Support this campaign on Potlock.";

    // Use cover_image_url field which is the correct field for campaign images
    const seoImage = campaign?.cover_image_url ?? APP_METADATA.openGraph.images.url;

    return {
      props: { seoTitle, seoDescription, seoImage },
      // Revalidate every 5 minutes (300 seconds) to keep data fresh
      revalidate: 300,
    };
  } catch (error) {
    console.error("Error generating static props:", error);

    // Return fallback props instead of throwing error to prevent 500
    // This allows the page to render with default SEO data
    return {
      props: {
        seoTitle: `Campaign ${params?.campaignId || ""}`,
        seoDescription: APP_METADATA.description,
        seoImage: APP_METADATA.openGraph.images.url,
      },
      // Shorter revalidate for error cases to retry sooner
      revalidate: 60,
    };
  }
};
