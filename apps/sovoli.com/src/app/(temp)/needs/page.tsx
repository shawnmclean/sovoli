import type { Metadata } from "next";

import { NeedsExplorer } from "./components/NeedsExplorer";
import type { NeedsExplorerEntry } from "./components/NeedsExplorer";
import { ORGS } from "~/modules/data/organisations";
import { formatItemCategoryLabel } from "~/modules/core/items/utils";
import { formatNeedTypeLabel } from "~/modules/needs/utils";
import { isMaterialNeed } from "~/modules/needs/types";

export const metadata: Metadata = {
  title: "Hurricane Relief Needs Directory",
  description:
    "Browse hurricane recovery needs from partner schools and organisations to coordinate support and donations.",
  openGraph: {
    title: "Hurricane Relief Needs Directory",
    description:
      "Explore supplies, services, and support requests that schools have shared for disaster recovery.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hurricane Relief Needs Directory",
    description:
      "Discover the priority needs of schools coordinating hurricane relief and recovery.",
  },
};

function collectNeedEntries(): NeedsExplorerEntry[] {
  return ORGS.flatMap((orgInstance) => {
    const needsModule = orgInstance.needsModule;
    if (!needsModule) {
      return [] as NeedsExplorerEntry[];
    }

    const siteName = orgInstance.websiteModule?.website.siteName ?? orgInstance.org.name;
    const locationMap = new Map(
      orgInstance.org.locations.map((location) => [location.key, location]),
    );

    return needsModule.needs.map((need) => {
      const locationKey = need.requestingUnit?.locationKey;
      const location = locationKey ? locationMap.get(locationKey) : undefined;
      const locationAddress = location?.address;

      let categoryKey: string;
      let categoryLabel: string;
      let categoryType: NeedsExplorerEntry["categoryType"];
      let isReliefNeed = false;

      if (isMaterialNeed(need)) {
        categoryKey = `item:${need.item.category}`;
        categoryLabel = formatItemCategoryLabel(need.item.category);
        categoryType = "item";
        const tags = need.item.tags ?? [];
        isReliefNeed = tags.some((tag) => tag.toLowerCase() === "relief");
      } else {
        categoryKey = `need:${need.type}`;
        categoryLabel = formatNeedTypeLabel(need.type);
        categoryType = "need";
      }

      return {
        id: `${orgInstance.org.username}:${need.slug}`,
        need,
        orgName: orgInstance.org.name,
        orgUsername: orgInstance.org.username,
        orgSiteName: siteName,
        locationLabel: location?.label,
        locationAddressLine1: locationAddress?.line1,
        locationCity: locationAddress?.city,
        locationCountryCode: locationAddress?.countryCode,
        categoryKey,
        categoryLabel,
        categoryType,
        isReliefNeed,
      } satisfies NeedsExplorerEntry;
    });
  });
}

export default function NeedsDirectoryPage() {
  const entries = collectNeedEntries();
  const totalNeeds = entries.length;
  const organisationCount = new Set(entries.map((entry) => entry.orgUsername)).size;

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <section className="border-b border-default-200 bg-default-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Disaster Response
            </p>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Hurricane Relief Needs
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground">
              Browse active supply, service, and staffing requests submitted by
              Sovoli partner schools. Relief-focused categories are pre-selected so
              you can prioritise immediate hurricane recovery work.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>
              {totalNeeds} need{totalNeeds === 1 ? "" : "s"} from {organisationCount}{" "}
              organisation{organisationCount === 1 ? "" : "s"}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/60 sm:block" aria-hidden />
            <span>
              Filters default to hurricane relief supplies — toggle categories to
              explore every request.
            </span>
          </div>
        </div>
      </section>

      <NeedsExplorer entries={entries} />
    </main>
  );
}
