import { HeroSection } from "./components/HeroSection";

export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  return (
    <div>
      <HeroSection />
      Subdomain Page: {subdomain}
    </div>
  );
}
