import type { GetServerSideProps } from "next";

// This page only exists to redirect to the main campaign page with tab=settings
// The actual content is rendered by the main index.tsx page

export default function CampaignSettingsPage() {
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
      destination: `/campaign/${campaignId}?tab=settings`,
      permanent: true, // Use permanent redirect for SEO
    },
  };
};
