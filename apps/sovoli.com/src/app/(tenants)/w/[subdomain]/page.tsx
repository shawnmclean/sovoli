import { HeroSection } from "./components/HeroSection";
import { MetricsSection } from "./components/MetricsSection";
import { ProgramsSection } from "./components/ProgramsSection";

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
      <ProgramsSection />
      Subdomain Page: {subdomain}
    </div>
  );
}
