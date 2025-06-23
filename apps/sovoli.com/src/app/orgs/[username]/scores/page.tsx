import { notFound } from "next/navigation";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Badge } from "@sovoli/ui/components/badge";
import {
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  ExternalLinkIcon,
  UsersIcon,
  ShieldIcon,
} from "lucide-react";

import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { computeOrgScoring } from "~/modules/scoring/lib/computeOrgScoring";
import { ScoringBreakdown } from "~/modules/scoring/components/ScoringBreakdown";
import { ruleSets } from "~/modules/scoring/ruleSets";

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
    </div>
  );
}
