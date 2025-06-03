import { PageAssembler } from "~/modules/websites/components/PageAssembler";
import { GetAllWebsiteUsernamesQuery } from "~/modules/websites/services/queries/GetAllWebsiteUsernames";
import { bus } from "~/services/core/bus";
import { orgWebConfig } from "../data";
import { NewsSection } from "./components/NewsSection";
import { ProgramsSection } from "./components/ProgramsSection";
import { TeamSection } from "./components/TeamSection";

export async function generateStaticParams() {
  const result = await bus.queryProcessor.execute(
    new GetAllWebsiteUsernamesQuery(),
  );
  return result.usernames.map((username) => ({
    username,
  }));
}

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
