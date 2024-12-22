import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { config } from "~/utils/config";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
