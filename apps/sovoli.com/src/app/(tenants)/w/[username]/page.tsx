import { notFound } from "next/navigation";
import { PageAssembler } from "~/modules/websites/components/PageAssembler";
import { GetAllWebsiteUsernamesQuery } from "~/modules/websites/services/queries/GetAllWebsiteUsernames";
import { bus } from "~/services/core/bus";
import { orgWebConfig } from "../data";
import { NewsSection } from "./components/NewsSection";
import { ProgramsSection } from "./components/ProgramsSection";
import { TeamSection } from "./components/TeamSection";

import { getOrgInstanceByUsername } from "./lib/getOrgInstanceByUsername";

const retreiveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

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
  const orgInstance = await retreiveOrgInstance(username);

  return (
    <div>
      {orgInstance.org.username === "fitright" && (
        <ProgramsSection orgInstance={orgInstance} />
      )}
      {orgInstance.org.username === "magy" && (
        <>
          <PageAssembler page={orgWebConfig.home} editable={false} />

          <ProgramsSection orgInstance={orgInstance} />
          <TeamSection />
          <NewsSection />
        </>
      )}
    </div>
  );
}
