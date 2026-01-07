import type { GetServerSideProps } from "next";

// This page only exists to redirect to the main campaign page with tab=leaderboard
// The actual content is rendered by the main index.tsx page

export default function CampaignLeaderboardPage() {
  // This component should never render because getServerSideProps redirects
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const campaignId = params?.campaignId as string;

  if (!campaignId) {
    return { notFound: true };
  }

  // Server-side redirect to main campaign page with tab query param
  return {
    redirect: {
      destination: `/campaign/${campaignId}?tab=leaderboard`,
      permanent: true, // Use permanent redirect for SEO
    },
  };
};
