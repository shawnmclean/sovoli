import { config } from "~/utils/config";
import { FindSchoolsSection } from "../(marketing)/components/FindSchoolsSection";
import { HurricaneMelissaSection } from "../(marketing)/components/HurricaneMelissaSection";
import { SovoliBusinessSection } from "../(marketing)/components/SovoliBusinessSection";
import { TrendingSection } from "../(marketing)/components/TrendingSection";

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
