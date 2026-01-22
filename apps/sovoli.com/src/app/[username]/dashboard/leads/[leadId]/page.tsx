import { notFound } from "next/navigation";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { bus } from "~/services/core/bus";

import { getLeadsForOrg } from "../../_lib/getLeadsForOrg";
import { LeadDetailView } from "./components/LeadDetailView";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ username: string; leadId: string }>;
}) {
  const { username, leadId } = await params;

  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  const orgInstance = result.orgInstance;
  if (!orgInstance) return notFound();

  const leads = getLeadsForOrg(username);
  const lead = leads.find((l) => l.id === leadId);
  if (!lead) return notFound();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
      <LeadDetailView orgInstance={orgInstance} initialLead={lead} />
    </div>
  );
}
