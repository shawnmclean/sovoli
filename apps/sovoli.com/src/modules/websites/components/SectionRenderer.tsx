import type { PageSection } from "~/modules/websites/types";
import { sectionRegistry } from "./SectionRegistry";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";

interface SectionRendererProps {
  section: PageSection;
  editable?: boolean;
  orgInstance: OrgInstanceWithWebsite;
}

export function SectionRenderer({
  section,
  orgInstance,
}: SectionRendererProps) {
  const Component = sectionRegistry[section.type];
  if (!Component) return null;

  return <Component section={section} orgInstance={orgInstance} />;
}
