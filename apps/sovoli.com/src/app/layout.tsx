import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import { config } from "~/utils/config";
import { detectCountryFromHeaders } from "~/utils/currencyDetection";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: config.title,
    template: `%s | ${config.siteName}`,
  },
  description: config.description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: config.title,
    description: config.description,
    url: config.url,
    siteName: config.siteName,
    images: config.images,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const countryCode = detectCountryFromHeaders(headersList);

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
      <body>
        <Providers countryCode={countryCode}>{children}</Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
