import type { Metadata, Viewport } from "next";
import { Lora as FontSans } from "next/font/google";
import "@near-wallet-selector/modal-ui/styles.css";

import "@app/styles/mona-sans-font.css";
import "@app/styles/globals.css";

import { cn } from "@app/components/lib/utils";
import Nav from "@app/components/Nav/Nav";

import Providers from "./Providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
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
        className={`${cn("font-sans antialiased", fontSans.variable)} container`}
      >
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
