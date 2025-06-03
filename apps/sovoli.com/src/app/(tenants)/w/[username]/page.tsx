import { PageAssembler } from "~/modules/websites/components/PageAssembler";
import { orgWebConfig } from "../data";
import { NewsSection } from "./components/NewsSection";
import { ProgramsSection } from "./components/ProgramsSection";
import { TeamSection } from "./components/TeamSection";

export default async function WebsitePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return (
    <div>
      <PageAssembler page={orgWebConfig.home} editable={false} />

      <ProgramsSection />
      <TeamSection />
      <NewsSection />
      <div className="my-4 px-5 text-right text-default-200">
        Username: {username}
      </div>
    </div>
  );
}
