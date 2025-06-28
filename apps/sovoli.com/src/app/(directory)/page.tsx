import { config } from "~/utils/config";
import { CTASection } from "../(marketing)/components/CTASection";
import { HeroSection } from "../(marketing)/components/HeroSection";
import { TrendingSection } from "../(marketing)/components/TrendingSection";
import { SchoolAdminSection } from "../(marketing)/components/SchoolAdminSection";

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
      <HeroSection title="Find Private Schools in Guyana" />
      <CTASection />
      <TrendingSection />
      <SchoolAdminSection />
    </main>
  );
}
