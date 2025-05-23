import { PageAssembler } from "~/modules/website/components/PageAssembler";
import { NewsSection } from "./components/NewsSection";
import { ProgramsSection } from "./components/ProgramsSection";
import { TeamSection } from "./components/TeamSection";
import { orgWebConfig } from "./data";

export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  return (
    <div>
      <PageAssembler page={orgWebConfig.home} editable={false} />

      <ProgramsSection />
      <TeamSection />
      <NewsSection />
      <div className="my-4 px-5 text-right text-default-200">
        Subdomain: {subdomain}
      </div>
    </div>
  );
}
