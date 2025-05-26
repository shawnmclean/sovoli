import type { PageSection } from "~/modules/website/types";
import { sectionRegistry } from "./SectionRegistry";

interface SectionRendererProps {
  section: PageSection;
  editable?: boolean;
  content?: unknown[];
}

export function SectionRenderer({
  section,
  editable = false,
  content,
}: SectionRendererProps) {
  const Component = sectionRegistry[section.type];
  if (!Component) return null;

  return <Component section={section} content={content} editable={editable} />;
}
