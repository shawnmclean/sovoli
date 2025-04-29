import { config } from "~/utils/config";
import { CTASection } from "./components/CTASection";
import { GallerySection } from "./components/GallerySection";
import { HeroSection } from "./components/HeroSection";

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
      <GallerySection />
      <div className="mx-auto mt-12 max-w-xl text-center text-sm text-default-500">
        Built by engineers with global experience in Education, Cybersecurity,
        and Artificial Intelligence —
        <br />
        guided by over 40 years of leadership in schools and teaching.
      </div>
    </main>
  );
}
