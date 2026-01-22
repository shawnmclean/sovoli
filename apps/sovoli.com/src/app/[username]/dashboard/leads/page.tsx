import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { notFound } from "next/navigation";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { bus } from "~/services/core/bus";
import {
  getLeadsForOrg,
  isLeadsConfiguredForOrg,
} from "../_lib/getLeadsForOrg";
import type { LeadsSummaryStats } from "../programs/[slug]/leads/components/LeadsSummaryCards";
import { LeadsSummaryCards } from "../programs/[slug]/leads/components/LeadsSummaryCards";
import type { LeadInteraction } from "../programs/[slug]/leads/utils/leadCategorization";
import { categorizeLead } from "../programs/[slug]/leads/utils/leadCategorization";

const retreiveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

export default async function LeadsDashboardPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  const leads = getLeadsForOrg(username);
  const totalLeadsCount = leads.length;

  const leadStats = (() => {
    const stats: LeadsSummaryStats = {
      strong: 0,
      uncertain: 0,
      lowIntent: 0,
      noVisibility: 0,
    };

    for (const lead of leads) {
      const interactions = (lead.interactions ?? []) as LeadInteraction[];
      const systemState = categorizeLead(lead, interactions);
      if (systemState.category === "strong") stats.strong++;
      else if (systemState.category === "uncertain") stats.uncertain++;
      else if (systemState.category === "lowIntent") stats.lowIntent++;
      else stats.noVisibility++;
    }

    return stats;
  })();

  const baseDashboardPath = `/${username}/dashboard`;
  const leadsConfigured = isLeadsConfiguredForOrg(username);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Leads</h1>
        <p className="text-default-500">
          All leads across your programs, with quick follow-ups.
        </p>
      </div>

      <LeadsSummaryCards stats={leadStats} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardBody className="space-y-1">
            <div className="text-xs font-medium text-default-500 uppercase tracking-wider">
              Total Leads
            </div>
            <div className="text-3xl font-bold text-default-900">
              {totalLeadsCount}
            </div>
            {!leadsConfigured && (
              <div className="text-sm text-default-500">
                Leads not configured for this organization yet.
              </div>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-1">
            <div className="text-xs font-medium text-default-500 uppercase tracking-wider">
              New / No Activity
            </div>
            <div className="text-3xl font-bold text-danger">
              {leadStats.noVisibility}
            </div>
            <div className="text-sm text-default-500">
              Leads with no logged follow-up.
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-1">
            <div className="text-xs font-medium text-default-500 uppercase tracking-wider">
              Strong
            </div>
            <div className="text-3xl font-bold text-success">
              {leadStats.strong}
            </div>
            <div className="text-sm text-default-500">
              Leads ready to proceed.
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          as={Link}
          href={`${baseDashboardPath}/leads/list`}
          color="primary"
          radius="full"
        >
          View all leads
        </Button>
        <Button
          as={Link}
          href={`${baseDashboardPath}/programs`}
          variant="flat"
          color="default"
          radius="full"
        >
          Browse programs
        </Button>
        <div className="flex-1" />
        <div className="text-sm text-default-500">
          Tenant: <span className="font-medium">{orgInstance.org.name}</span>
        </div>
      </div>
    </div>
  );
}
