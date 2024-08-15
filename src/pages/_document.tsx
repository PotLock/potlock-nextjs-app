import { Head, Html, Main, NextScript } from "next/document";

// Assuming APP_METADATA is defined and imported from a constants file
import { APP_METADATA } from "@/common/constants";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta tags for description and image */}
        <meta name="description" content={APP_METADATA.description} />
        <meta name="image" content={APP_METADATA.openGraph.images.url} />

        {/* Favicon link */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />

        {/* Open Graph meta tags for social sharing */}
        <meta property="og:title" content={APP_METADATA.title} />
        <meta property="og:description" content={APP_METADATA.description} />
        <meta property="og:image" content={APP_METADATA.openGraph.images.url} />

        {/* Meta tag for Twitter Card (X) */}
        <meta property="twitter:card" content="summary_large_image" />

        {/* Preconnect to fonts CDN */}
        <link
          rel="preconnect"
          href="https://fonts.cdnfonts.com"
          crossOrigin="anonymous"
        />
      </Head>

      <body>
        {/* Main content */}
        <Main />
        {/* Next.js scripts */}
        <NextScript />
      </body>
    </Html>
  );
}
