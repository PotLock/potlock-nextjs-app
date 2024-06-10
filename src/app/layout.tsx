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
import "uno.css";

import type { Metadata, Viewport } from "next";
import { Lora } from "next/font/google";

import { cn } from "@/common/ui/utils";

import Nav from "./_layout/Nav";
import { RootProvider } from "./_layout/RootProvider";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Potlock",
  description: "Bringing public goods funding to the table, built on NEAR",
  manifest: "/manifest.json",

  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },

  // Facebook Meta / Twitter Tags
  openGraph: {
    url: "https://bos.potlock.org/?tab=project&projectId=opact.near",
    type: "website",
    images: {
      url: "https://bos.potlock.org/preview.png",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${cn("font-lora antialiased", lora.variable)}`}>
        <RootProvider>
          <div className="container">
            <Nav />
            {children}
          </div>
        </RootProvider>
      </body>
    </html>
  );
}
