import { Head, Html, Main, NextScript } from "next/document";

import { APP_METADATA, DEBUG } from "@/common/constants";

export default function Document() {
  return (
    <Html
      lang="en"
      style={DEBUG ? { background: "#000!important" } : undefined}
    >
      <Head>
        {/* Meta tags for description and image */}
        <meta name="description" content={APP_METADATA.description} />
        <meta name="image" content={APP_METADATA.openGraph.images.url} />
        <link rel="icon" href="/favicon.ico" sizes="all" />

        {/* Open Graph meta tags for social sharing */}
        <meta property="og:title" content={APP_METADATA.title} />
        <meta property="og:description" content={APP_METADATA.description} />
        <meta property="og:image" content={APP_METADATA.openGraph.images.url} />

        {/* Meta tags for X ( formerly Twitter ) */}
        <meta property="twitter:card" content="summary_large_image" />

        {/* Preconnect to fonts CDN */}
        <link
          rel="preconnect"
          href="https://fonts.cdnfonts.com"
          crossOrigin="anonymous"
        />
      </Head>

      <body
        className="text-foreground"
        style={DEBUG ? { background: "#000!important" } : undefined}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
