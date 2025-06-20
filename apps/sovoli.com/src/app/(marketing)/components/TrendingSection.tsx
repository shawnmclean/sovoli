import { Avatar } from "@sovoli/ui/components/avatar";
import { Link } from "@sovoli/ui/components/link";
import { ORGS } from "~/modules/data/organisations";

export function TrendingSection() {
  // Get trending schools (top 6 by score)
  const allSchools = ORGS.filter((org) =>
    org.org.categories.includes("private-school"),
  ).sort((a, b) => b.scoringModule.totalScore - a.scoringModule.totalScore);

  // Always include the top school
  const topSchool = allSchools[0];
  const otherSchools = allSchools.slice(1);

  // Randomize the remaining schools and take 3 more
  const randomizedOthers = otherSchools
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Combine top school with randomized others
  const trendingSchools = [topSchool, ...randomizedOthers];

  return (
    <section className="z-20 w-full max-w-screen-lg mt-12">
      {/* Headline */}
      <h2 className="text-2xl font-bold leading-tight tracking-tight mb-6">
        Schools You Might Like
      </h2>

      {/* Schools Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {trendingSchools.map((school) => (
          <Link
            key={school?.org.username}
            href={`/orgs/${school?.org.username}`}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-default-100 transition-colors"
          >
            <Avatar
              src={school?.org.logo}
              name={school?.org.name}
              size="lg"
              className="w-16 h-16"
            />
            <p className="text-sm font-medium text-center line-clamp-2">
              {school?.org.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
