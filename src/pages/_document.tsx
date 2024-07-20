import { Head, Html, Main, NextScript } from "next/document";

import { APP_METADATA } from "@/common/constants";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content={APP_METADATA.description} />
        <meta name="image" content={APP_METADATA.openGraph.images.url} />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />

        {/* Open Graph */}
        <meta property="og:title" content={APP_METADATA.title} />
        <meta property="og:description" content={APP_METADATA.description} />
        <meta property="og:image" content={APP_METADATA.openGraph.images.url} />

        {/* X */}
        <meta property="twitter:card" content="summary_large_image"></meta>

        <link
          rel="preconnect"
          href="https://fonts.cdnfonts.com"
          crossOrigin="anonymous"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
