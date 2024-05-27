import type { Metadata, Viewport } from "next";
import { Lora } from "next/font/google";
import "@near-wallet-selector/modal-ui/styles.css";

import "@app/styles/mona-sans-font.css";
import "@app/styles/globals.css";

import { cn } from "@app/modules/core/utils";
import Nav from "@modules/core/components/Nav";

import Providers from "./Providers";

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
      <body
        className={`${cn("font-lora antialiased", lora.variable)} container`}
      >
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
