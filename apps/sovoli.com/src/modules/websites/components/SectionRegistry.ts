import type { PageSection } from "~/modules/website/types";
import { Cards } from "./sections/Cards/Cards";
// import { Cards } from "./sections/Cards/Cards";
import { Hero } from "./sections/Hero/Hero";
import { Metrics } from "./sections/Metrics/Metrics";

// import { Metrics } from "./sections/Metrics/Metrics";

// import more as needed...

type SectionComponent = React.ComponentType<{
  section: PageSection;
  content?: unknown[];
  editable?: boolean;
}>;

export const sectionRegistry: Record<string, SectionComponent> = {
  hero: Hero,
  metrics: Metrics,
  cards: Cards,
  //   cards: Cards,
  // future: team, gallery, news, etc.
};
