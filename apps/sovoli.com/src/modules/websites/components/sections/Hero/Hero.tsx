import type { PageSection } from "~/modules/websites/types";
import { ImageHero } from "./variants/ImageHero";

// import { MinimalHero } from "./variants/MinimalHero";
// import { SplitHero } from "./variants/SplitHero";

export interface HeroProps {
  section: PageSection;
}

export function Hero({ section }: HeroProps) {
  const { variant = "image", layout } = section;

  switch (variant) {
    case "default":
    default:
      return <ImageHero section={section} layout={layout} />;

    // case "minimal":
    //   return <MinimalHero section={section} />;

    // case "split":
    //   return <SplitHero section={section} />;
  }
}
