import { notFound } from "next/navigation";
import { Footer } from "~/components/footer/Footer";
import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@sovoli/ui/components/button";
import { SchoolHeader } from "./components/SchoolHeader";
import { SchoolNavigation } from "./components/SchoolNavigation";
import { Link } from "@sovoli/ui/components/link";
import { countryCodeToName } from "~/utils/countryUtils";
import { RulesAttentionSummary } from "~/modules/scoring/components/RulesAttentionSummary";
import { categoryRuleSets } from "~/modules/scoring/ruleSets";
import type { ScoredRule } from "~/modules/scoring/types";

const retreiveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  return {
    title: {
      absolute: orgInstance.org.name,
      template: `%s | ${orgInstance.org.name}`,
    },
    description: `Profile page for ${orgInstance.org.name}`,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: orgInstance.org.name,
      description: `Profile page for ${orgInstance.org.name}`,
      url: `https://sovoli.com/orgs/${orgInstance.org.username}`,
      siteName: orgInstance.org.name,
      images: orgInstance.org.logo,
    },
  };
}

export default async function Layout({ children, params }: Props) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  const primaryLocation = orgInstance.org.locations[0];

  // Get the rule set for the org's category
  const category = orgInstance.org.categories[0] ?? "private-school";
  const ruleSet = categoryRuleSets[category];

  // Extract rules that need attention (incomplete rules)
  const rulesThatNeedAttention = orgInstance.scoringModule
    ? Object.fromEntries(
        ruleSet?.groups
          .flatMap((group) => group.rules)
          .reduce<[string, ScoredRule][]>((acc, ruleKey) => {
            const scoredRule =
              orgInstance.scoringModule?.result.ruleScores[ruleKey];
            const isIncomplete =
              scoredRule &&
              scoredRule.maxScore > 0 &&
              scoredRule.score !== scoredRule.maxScore;

            if (isIncomplete) {
              acc.push([ruleKey, scoredRule]);
            }
            return acc;
          }, []) ?? [],
      )
    : {};

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <div className="w-full md:w-1/3">
          <Button
            as={Link}
            href={`/d/${orgInstance.org.categories[0]?.toLowerCase()}/${countryCodeToName(primaryLocation?.address.countryCode ?? "")}`}
            variant="light"
            startContent={<ArrowLeftIcon className="w-4 h-4" />}
            size="sm"
          >
            Directory
          </Button>
        </div>
        <SchoolHeader orgInstance={orgInstance} />

        <SchoolNavigation orgInstance={orgInstance} />

        {ruleSet && orgInstance.scoringModule && (
          <div className="w-full md:w-2/3 px-4">
            <RulesAttentionSummary
              rulesScore={rulesThatNeedAttention}
              ruleSet={ruleSet}
              orgUsername={orgInstance.org.username}
            />
          </div>
        )}

        <div className="w-full md:w-2/3">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
