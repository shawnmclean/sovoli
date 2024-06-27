/** @jsxImportSource react */

import type { Metadata } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { StylesProvider } from "@sovoli/ui/providers/index";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StylesProvider>{children}</StylesProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
