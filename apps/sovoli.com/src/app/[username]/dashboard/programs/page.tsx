import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { notFound } from "next/navigation";
import type { Program } from "~/modules/academics/types";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { bus } from "~/services/core/bus";
import { getLeadsForOrg } from "../_lib/getLeadsForOrg";

const retreiveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

export default async function DashboardProgramsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  const programs = orgInstance.academicModule?.programs ?? [];
  const allLeads = getLeadsForOrg(username);

  const getLeadsCountForProgram = (program: Program): number => {
    if (allLeads.length === 0) return 0;

    const cycleIds = new Set((program.cycles ?? []).map((c) => c.id));

    return allLeads.filter((lead) => {
      if (lead.programId && lead.programId === program.id) return true;
      if (lead.cycleId && cycleIds.has(lead.cycleId)) return true;
      return false;
    }).length;
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Programs</h1>
        <p className="text-default-500">
          Browse your programs and open each lead report.
        </p>
      </div>

      {programs.length === 0 ? (
        <div className="p-8 text-center text-default-500">
          No programs found for this organization.
        </div>
      ) : (
        <div className="grid gap-3">
          {programs.map((program) => {
            const leadsCount = getLeadsCountForProgram(program);

            return (
              <Link
                key={program.id}
                href={`/${username}/dashboard/programs/${program.slug}/leads`}
                color="foreground"
                className="block"
              >
                <Card className="hover:bg-default-50 transition-colors">
                  <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <div className="font-semibold text-default-900 truncate">
                        {program.name}
                      </div>
                      <div className="text-sm text-default-500">
                        {leadsCount} {leadsCount === 1 ? "lead" : "leads"}
                      </div>
                    </div>
                    <div className="text-sm text-default-500">View leads</div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
