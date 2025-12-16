import { config } from "~/utils/config";
import { TrendingSection } from "../(marketing)/components/TrendingSection";
import { SovoliBusinessSection } from "../(marketing)/components/SovoliBusinessSection";
import { HurricaneMelissaSection } from "../(marketing)/components/HurricaneMelissaSection";
import { FindSchoolsSection } from "../(marketing)/components/FindSchoolsSection";

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
      <HurricaneMelissaSection />
      <FindSchoolsSection />
      <TrendingSection />
      <SovoliBusinessSection />
    </main>
  );
}
