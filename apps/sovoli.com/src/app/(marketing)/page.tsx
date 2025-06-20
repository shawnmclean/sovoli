import { config } from "~/utils/config";
import { CTASection } from "./components/CTASection";
import { HeroSection } from "./components/HeroSection";
import { TrendingSection } from "./components/TrendingSection";
import { SchoolAdminSection } from "./components/SchoolAdminSection";

export function generateMetadata() {
  return {
    openGraph: {
      url: config.url,
      siteName: config.siteName,
    },
  };
}

export default function LandingPage() {
  return (
    <main className="mx-auto w-full max-w-screen-lg px-4 pb-16 pt-6">
      <HeroSection />
      <CTASection />
      <TrendingSection />
      <SchoolAdminSection />
    </main>
  );
}
