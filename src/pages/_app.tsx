import "@unocss/reset/normalize.css";
import "@unocss/reset/sanitize/assets.css";
import "@unocss/reset/sanitize/sanitize.css";
import "@unocss/reset/tailwind.css";
import "@/common/ui/layout/styles/fonts.css";
import "@/common/ui/layout/styles/theme.css";
import "@/common/ui/layout/styles/uno.generated.css";

import { useEffect } from "react";

import { Provider as NiceModalProvider } from "@ebay/nice-modal-react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { Lora } from "next/font/google";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import { useSWRConfig } from "swr";

import { useToast } from "@/common/ui/layout/hooks";

import { APP_METADATA } from "@/common/constants";
import { TooltipProvider } from "@/common/ui/layout/components";
import { Toaster } from "@/common/ui/layout/components/molecules/toaster";
import { cn } from "@/common/ui/layout/utils";
import { WalletUserSessionProvider } from "@/common/wallet";
import { AppBar } from "@/layout/components/app-bar";
import { CampaignRouteLoading } from "@/layout/components/campaign-route-loading";
import { store } from "@/store";

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

function PingPayBroadcastListener() {
  const { mutate } = useSWRConfig();
  const { toast } = useToast();

  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("pingpay");
      channel.onmessage = (e) => {
        if (e.data?.type === "pingpay-complete") {
          if (e.data?.paymentStatus === "success") {
            toast({
              title: "Donation Successful",
              description: "Your donation has been recorded.",
            });
          }
          mutate(() => true, undefined, { revalidate: true });
        }
      };
    } catch {
      // BroadcastChannel unsupported
    }
    return () => {
      channel?.close();
    };
  }, [mutate, toast]);

  return null;
}

export default function RootLayout({ Component, pageProps }: AppPropsWithLayout) {
  useEffect(() => void store.dispatch.core.init(), []);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <WalletUserSessionProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{APP_METADATA.title}</title>
      </Head>

      <ReduxProvider {...{ store }}>
        <PingPayBroadcastListener />
        <NiceModalProvider>
          <TooltipProvider>
            <div
              className={cn(
                "font-lora flex h-full flex-col items-center antialiased",
                lora.variable,
              )}
            >
              <AppBar />
              <CampaignRouteLoading>{getLayout(<Component {...pageProps} />)}</CampaignRouteLoading>
            </div>
          </TooltipProvider>
        </NiceModalProvider>
        <Toaster />
      </ReduxProvider>
    </WalletUserSessionProvider>
  );
}
