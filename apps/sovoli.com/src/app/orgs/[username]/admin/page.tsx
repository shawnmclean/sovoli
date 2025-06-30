import { notFound } from "next/navigation";

import { GetAllWebsiteUsernamesQuery } from "~/modules/websites/services/queries/GetAllWebsiteUsernames";
import { bus } from "~/services/core/bus";

import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { AdminScoreBreakdown } from "~/modules/scoring/components/AdminScoreBreakdown";
import { RulesAttentionSummary } from "~/modules/scoring/components/RulesAttentionSummary";
import { Button } from "@sovoli/ui/components/button";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { WhatsAppLink } from "~/components/WhatsAppLink";

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

  return (
    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 p-4 md:flex-row">
      <h1>Admin</h1>
      <RulesAttentionSummary orgInstance={orgInstance} />

      <AdminScoreBreakdown orgInstance={orgInstance} />

      <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
        <span className="text-sm text-default-500">Need help?</span>
        <Button
          as={WhatsAppLink}
          message={`Hello, I'd help with the scoring for ${org.name}.`}
          color="primary"
          variant="solid"
          intent="Submit Missing Info"
          role="admin"
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
