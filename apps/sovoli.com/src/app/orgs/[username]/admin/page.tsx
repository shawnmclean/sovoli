import { notFound } from "next/navigation";

import { GetAllWebsiteUsernamesQuery } from "~/modules/websites/services/queries/GetAllWebsiteUsernames";
import { bus } from "~/services/core/bus";

import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";

import { RulesAttentionSummary } from "~/modules/scoring/components/RulesAttentionSummary";

const retreiveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

export async function generateStaticParams() {
  //TODO: change query to get all org usernames
  const result = await bus.queryProcessor.execute(
    new GetAllWebsiteUsernamesQuery(),
  );
  return result.usernames.map((username) => ({
    username,
  }));
}

export default async function OrgClaimPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  return (
    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 p-4 md:flex-row">
      <h1>Admin</h1>
      <RulesAttentionSummary orgInstance={orgInstance} />
    </div>
  );
}
