import "@near-wallet-selector/modal-ui/styles.css";
import "@unocss/reset/normalize.css";
import "@unocss/reset/sanitize/assets.css";
import "@unocss/reset/sanitize/sanitize.css";
import "@unocss/reset/tailwind.css";
import "@/common/ui/styles/fonts.css";
import "@/common/ui/styles/theme.css";
import "@/common/ui/styles/uno.generated.css";
import "./global.css";

import { ReactElement, ReactNode, useEffect } from "react";

import { Provider as NiceModalProvider } from "@ebay/nice-modal-react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { Lora } from "next/font/google";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";

import { APP_METADATA } from "@/common/constants";
import { Toast } from "@/common/ui/components/toast/Toast";
import { cn } from "@/common/ui/utils";
import { AuthProvider } from "@/modules/auth/providers/AuthProvider";
import { Nav } from "@/modules/core";
import { dispatch, store } from "@/store";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function RootLayout({
  Component,
  pageProps,
}: AppPropsWithLayout) {
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
          <AuthProvider>
            <div
              un-flex="~ col"
              un-items="center"
              className={`${cn("font-lora antialiased", lora.variable)}`}
            >
              <Nav />
              {getLayout(<Component {...pageProps} />)}
              <Toast />
            </div>
          </AuthProvider>
        </NiceModalProvider>
      </ReduxProvider>
    </>
  );
}
