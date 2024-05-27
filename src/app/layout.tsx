import "@near-wallet-selector/modal-ui/styles.css";
import "./_layout/mona-sans-font.css";
import "./_layout/globals.css";

import type { Metadata, Viewport } from "next";
import { Lora as FontSans } from "next/font/google";

import { cn } from "@/common/ui/utils";

import Nav from "./_layout/Nav";
import Providers from "./_layout/RootProvider";

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
