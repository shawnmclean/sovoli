import { notFound } from "next/navigation";

import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { ScoringBreakdown } from "~/modules/scoring/components/ScoringBreakdown";
import { ruleSets } from "~/modules/scoring/ruleSets";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { Button } from "@sovoli/ui/components/button";
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
  const { scoringModule, org } = await retrieveOrgInstance(username);

  if (!scoringModule) return null;

  const category = org.categories[0] ?? "private-school";
  const ruleSet = ruleSets[category];
  if (!ruleSet) return null;

  return (
    <div className="space-y-4 p-2 sm:p-4 max-w-4xl mx-auto">
      <ScoringBreakdown scoringModule={scoringModule} ruleSet={ruleSet} />
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
        <span className="text-sm text-default-500">Need help?</span>
        <WhatsAppLink
          phoneNumber="+5926082743"
          message={`Hello, I'd help with the scoring for ${org.name}.`}
          color="success"
        >
          Message Us on WhatsApp!
        </WhatsAppLink>
      </div>
    </div>
  );
}
