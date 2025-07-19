import type { PageSection } from "~/modules/websites/types";
import { Cards } from "./sections/Cards/Cards";
// import { Cards } from "./sections/Cards/Cards";
import { Hero } from "./sections/Hero/Hero";
import { Metrics } from "./sections/Metrics/Metrics";

import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";
import { Team } from "./sections/Team/Team";

// import { Metrics } from "./sections/Metrics/Metrics";

// import more as needed...

type SectionComponent = React.ComponentType<{
  section: PageSection;
  orgInstance: OrgInstanceWithWebsite;
}>;

export const sectionRegistry: Record<string, SectionComponent> = {
  hero: Hero,
  metrics: Metrics,
  cards: Cards,

  team: Team,
};
