import { notFound } from "next/navigation";

import { GetAllWebsiteUsernamesQuery } from "~/modules/websites/services/queries/GetAllWebsiteUsernames";
import { bus } from "~/services/core/bus";

import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { AdminScoreBreakdown } from "~/modules/scoring/components/AdminScoreBreakdown";
import { RulesAttentionSummary } from "~/modules/scoring/components/RulesAttentionSummary";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { parseLeadsModule } from "~/modules/data/organisations/utils/parseLeadsModule";
import { LeadsSummaryCards } from "./programs/[slug]/leads/components/LeadsSummaryCards";
import type { LeadsSummaryStats } from "./programs/[slug]/leads/components/LeadsSummaryCards";
import { categorizeLead } from "./programs/[slug]/leads/utils/leadCategorization";
import type { LeadInteraction } from "./programs/[slug]/leads/utils/leadCategorization";
import type { Lead } from "./components/LeadsTable";

// Import leads data for healingemeraldwellness
import healingEmeraldLeadsData from "~/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/leads.json";

function getLeadsData(username: string): Lead[] {
  if (username === "healingemeraldwellness") {
    const leadsModule = parseLeadsModule(healingEmeraldLeadsData);
    return leadsModule.leads;
  }
  return [];
}

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

  const { org } = orgInstance;

  const leads = getLeadsData(username);
  const totalLeadsCount = leads.length;
  const leadsConfigured = username === "healingemeraldwellness";

  const leadsWithNoActivityCount = leads.filter(
    (lead) => (lead.interactions?.length ?? 0) === 0,
  ).length;
  const leadsWithActivityCount = totalLeadsCount - leadsWithNoActivityCount;

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

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
      <RulesAttentionSummary orgInstance={orgInstance} />

      <AdminScoreBreakdown orgInstance={orgInstance} />

      <div className="space-y-3">
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
                {leadsWithNoActivityCount}
              </div>
              <div className="text-sm text-default-500">
                Leads with no updates yet.
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-1">
              <div className="text-xs font-medium text-default-500 uppercase tracking-wider">
                Active Leads
              </div>
              <div className="text-3xl font-bold text-success">
                {leadsWithActivityCount}
              </div>
              <div className="text-sm text-default-500">
                Leads with at least 1 interaction.
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
        <span className="text-sm text-default-500">Need help?</span>
        <Button
          as={WhatsAppLink}
          message={`Hello, I'd help with the scoring for ${org.name}.`}
          color="primary"
          variant="solid"
          intent="Submit Missing Info"
          userRole="admin"
          page="scores"
          orgId={org.username}
          orgName={org.name}
          funnel="admin_scores"
          startContent={<SiWhatsapp size={16} />}
        >
          Message Us on WhatsApp!
        </Button>
      </div>
    </div>
  );
}
