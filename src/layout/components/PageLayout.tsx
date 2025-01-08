import Head from "next/head";
import { useRouter } from "next/router";

import { APP_METADATA } from "@/common/constants";
import { PageWithBanner } from "@/common/ui/components";

type PageLayoutProps = {
  title: string;
  description: string;
  image?: string;
  children: React.ReactNode;
};

export const PageLayout = ({ title, description, image, children }: PageLayoutProps) => {
  const router = useRouter();
  const { pathname, asPath } = router;
  const preferredDomain = "https://alpha.potlock.org";

  const domains = [
    "https://alpha.potlock.org",
    "https://alpha.potlock.com",
    "https://alpha.potlock.io",
  ];

  const paths = domains.map((domain) => `${domain}${asPath}`);

  const canonicalUrl = `${preferredDomain}${asPath}`;

  return (
    <>
      <Head key={pathname}>
        <meta charSet="UTF-8" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />

        <title>{`${title} | ${APP_METADATA.title}`}</title>
        <meta name="description" content={description} />
        {/* Canonical URL - points to preferred domain */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Alternate URLs for other domains */}
        {paths.map((url) => url !== canonicalUrl && <link key={url} rel="alternate" href={url} />)}

        {/* Open Graph */}
        <meta property="og:site_name" content={APP_METADATA.title} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content={APP_METADATA.openGraph.type} />
        <meta property="og:image" content={image ?? APP_METADATA.openGraph.images.url} />

        {/* Twitter */}
        <meta name="twitter:card" content={APP_METADATA.twitter.card} />
        <meta name="twitter:site" content={APP_METADATA.twitter?.site} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image ?? APP_METADATA.openGraph.images.url} />

        <meta name="apple-mobile-web-app-title" content={APP_METADATA.title} />
      </Head>
      <PageWithBanner>{children}</PageWithBanner>
    </>
  );
};
