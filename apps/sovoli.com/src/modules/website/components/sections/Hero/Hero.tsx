import type { PageSection } from "~/modules/website/types";
import { ImageHero } from "./variants/ImageHero";

// import { MinimalHero } from "./variants/MinimalHero";
// import { SplitHero } from "./variants/SplitHero";

export interface HeroProps {
  section: PageSection;
}

export function Hero({ section }: HeroProps) {
  const variant = section.layout ?? "image";

  switch (variant) {
    case "image":
      return <ImageHero section={section} />;

    // case "minimal":
    //   return <MinimalHero section={section} />;

    // case "split":
    //   return <SplitHero section={section} />;

    default:
      return <ImageHero section={section} />;
  }
}
