import "@near-wallet-selector/modal-ui/styles.css";
import "./_layout/mona-sans-font.css";
import "./_layout/globals.css";

import type { Metadata, Viewport } from "next";
import { Lora } from "next/font/google";

import { cn } from "@/common/ui/utils";

import Nav from "./_layout/Nav";
import Providers from "./_layout/RootProvider";

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
        <Providers>
          <div className="container">
            <Nav />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
