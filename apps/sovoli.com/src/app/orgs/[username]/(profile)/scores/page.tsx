import { notFound } from "next/navigation";

import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";

import { categoryRuleSets } from "~/modules/scoring/ruleSets";
import { WhatsAppLink } from "~/components/WhatsAppLink";

import { Button } from "@sovoli/ui/components/button";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { PublicScoreBreakdown } from "~/modules/scoring/components/PublicScoreBreakdown";
import { Alert } from "@sovoli/ui/components/alert";
import { Link } from "@sovoli/ui/components/link";

const retrieveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

export default async function ScoresPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  const { org } = orgInstance;

  const category = org.categories[0] ?? "private-school";
  const ruleSet = categoryRuleSets[category];
  if (!ruleSet) return null;

  return (
    <div className="space-y-4 p-2 sm:p-4 max-w-4xl mx-auto">
      <PublicScoreBreakdown orgInstance={orgInstance} />

      <Alert
        hideIcon
        variant="faded"
        color="default"
        title="Are you the admin?"
        endContent={
          <Button
            as={Link}
            href={`/orgs/${org.username}/admin`}
            size="sm"
            variant="flat"
            color="default"
          >
            Improve
          </Button>
        }
      />
    </div>
  );
}
