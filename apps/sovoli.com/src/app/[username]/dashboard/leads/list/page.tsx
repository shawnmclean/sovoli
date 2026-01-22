import { notFound } from "next/navigation";
import type { Lead } from "~/modules/leads/types";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { bus } from "~/services/core/bus";
import { getLeadsForOrg } from "../../_lib/getLeadsForOrg";
import { LeadsListView } from "./components/LeadsListView";

export default async function LeadsListPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  const orgInstance = result.orgInstance;
  if (!orgInstance) return notFound();

  const leads = getLeadsForOrg(username);

  const enhancedLeads: Lead[] = leads.map((lead) => {
    // Ensure `programName` and `cycleLabel` are present so the shared
    // program lead cards can render cycle/program context consistently.
    if (lead.programName && lead.cycleLabel) return lead;

    const programs = orgInstance.academicModule?.programs ?? [];
    for (const program of programs) {
      const cycle = program.cycles?.find((c) => c.id === lead.cycleId);
      if (cycle) {
        const label =
          cycle.academicCycle.customLabel ??
          cycle.academicCycle.globalCycle?.label ??
          lead.cycleId;
        return {
          ...lead,
          programId: lead.programId ?? program.id,
          programName: lead.programName ?? program.name ?? "Program",
          cycleLabel: lead.cycleLabel ?? label,
        };
      }
      if (lead.programId && lead.programId === program.id) {
        return {
          ...lead,
          programName: lead.programName ?? program.name ?? "Program",
          cycleLabel: lead.cycleLabel ?? lead.cycleId,
        };
      }
    }

    return {
      ...lead,
      programName: lead.programName ?? "Program",
      cycleLabel: lead.cycleLabel ?? lead.cycleId,
    };
  });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">All Leads</h1>
        <p className="text-default-500">
          Search and filter leads across all programs.
        </p>
      </div>

      <LeadsListView initialLeads={enhancedLeads} orgInstance={orgInstance} />
    </div>
  );
}
