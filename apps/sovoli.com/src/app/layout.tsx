import "@sovoli/ui/config/tailwind/globals.css";
import "raf/polyfill";

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PortalHost } from "@rn-primitives/portal";
import { UiProviders } from "@sovoli/ui/providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { QueryProviders } from "~/api/react";
import { config } from "~/utils/config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

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
    images: [
      // {
      //   url: "https://sovoli.com/images/og-image.png",
      //   width: 1200,
      //   height: 630,
      //   alt: "Sovoli: Your Ultimate Book Organizer",
      // },
    ],
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UiProviders>
          <QueryProviders>{children}</QueryProviders>
        </UiProviders>
        <SpeedInsights />
        <Analytics />
        <PortalHost />
      </body>
    </html>
  );
}
