/** @jsxImportSource react */
import "@sovoli/ui/config/tailwind/globals.css";
import "raf/polyfill";

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { UiProviders } from "@sovoli/ui/providers";
import { PortalHost } from "@rn-primitives/portal";
import { TRPCReactProvider } from "~/api/trpc/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Sovoli: Your Ultimate Book Organizer",
  description:
    "Track your reading progress, write notes, and share your library with Sovoli. Start organizing your knowledge today!",
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
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </UiProviders>
        <SpeedInsights />
        <Analytics />
        <PortalHost />
      </body>
    </html>
  );
}
