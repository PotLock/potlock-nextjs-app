import "@near-wallet-selector/modal-ui/styles.css";
import "@unocss/reset/normalize.css";
import "@unocss/reset/sanitize/assets.css";
import "@unocss/reset/sanitize/sanitize.css";
import "@unocss/reset/tailwind.css";
import "@/common/ui/styles/fonts.css";
import "@/common/ui/styles/theme.css";
import "@/common/ui/styles/uno.generated.css";

import { useEffect } from "react";

import { Provider as NiceModalProvider } from "@ebay/nice-modal-react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { Lora } from "next/font/google";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";

import { APP_METADATA } from "@/common/constants";
import { Toaster } from "@/common/ui/components/molecules/toaster";
import { cn } from "@/common/ui/utils";
import { SessionProvider } from "@/entities/session";
import { AppBar } from "@/layout/components/AppBar";
import { dispatch, store } from "@/store";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function RootLayout({ Component, pageProps }: AppPropsWithLayout) {
  useEffect(() => void dispatch.core.init(), []);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{APP_METADATA.title}</title>
      </Head>

      <ReduxProvider {...{ store }}>
        <NiceModalProvider>
          <SessionProvider>
            <div
              className={`${cn("flex h-full flex-col items-center font-lora antialiased", lora.variable)}`}
            >
              <AppBar />
              {getLayout(<Component {...pageProps} />)}
            </div>
          </SessionProvider>
        </NiceModalProvider>
        <Toaster />
      </ReduxProvider>
    </>
  );
}
