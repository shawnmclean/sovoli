import { HeroSection } from "./components/HeroSection";
import { MetricsSection } from "./components/MetricsSection";
import { MissionVisionSection } from "./components/MissionVisionSection";
import { NewsSection } from "./components/NewsSection";
import { ProgramsSection } from "./components/ProgramsSection";
import { TeamSection } from "./components/TeamSection";

export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  return (
    <div>
      <HeroSection />
      <MetricsSection />
      <MissionVisionSection />
      <ProgramsSection />
      <TeamSection />
      <NewsSection />
      <div className="my-4 px-5 text-right text-default-200">
        Subdomain: {subdomain}
      </div>
    </div>
  );
}
