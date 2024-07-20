import "@near-wallet-selector/modal-ui/styles.css";
import "@unocss/reset/normalize.css";
import "@unocss/reset/sanitize/assets.css";
import "@unocss/reset/sanitize/sanitize.css";
import "@unocss/reset/tailwind.css";
import "./_layout/mona-sans-font.css";
import "./_layout/globals.css";
/**
 * ?INFO: This is a virtual import managed by Next
 **/
// eslint-disable-next-line import/no-unresolved
// import "uno.css";

import { Lora } from "next/font/google";
import Head from "next/head";

import { APP_METADATA } from "@/common/constants";
import { cn } from "@/common/ui/utils";

import Nav from "./_layout/Nav";
import { RootProvider } from "./_layout/RootProvider";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{APP_METADATA.title}</title>
      </Head>

      <RootProvider>
        <div
          className={`${cn("container font-lora antialiased", lora.variable)}`}
        >
          <Nav />
          {children}
        </div>
      </RootProvider>
    </>
  );
}
