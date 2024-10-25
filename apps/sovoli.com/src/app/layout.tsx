import "@sovoli/ui/styles/globals.css";

import type { Metadata } from "next";
import { UiProviders } from "@sovoli/ui/providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { QueryProviders } from "~/api/react";
import { config } from "~/utils/config";

export const metadata: Metadata = {
  title: {
    default: config.title,
    template: `%s | ${config.siteName}`,
  },
  description: config.description,
  openGraph: {
    title: config.title,
    description: config.description,
    url: config.url,
    siteName: config.siteName,
    images: config.images,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <UiProviders>
          <QueryProviders>{children}</QueryProviders>
        </UiProviders>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
