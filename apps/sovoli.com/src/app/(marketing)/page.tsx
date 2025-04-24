import type { Metadata } from "next";

import { config } from "~/utils/config";
import { HeroSection } from "./components/HeroSection";

// import { Image } from "@sovoli/ui/components/image";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return {
    openGraph: {
      url: config.url,
      siteName: config.siteName,
    },
  };
}

export default function LandingPage() {
  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center overflow-hidden">
      <HeroSection />
    </main>
  );
}
