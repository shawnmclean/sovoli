import type { PageConfig, PageSection } from "~/modules/websites/types";
import { SectionRenderer } from "./SectionRenderer";

interface PageAssemblerProps {
  page: PageConfig;
  editable?: boolean;
}

export function PageAssembler({ page, editable = false }: PageAssemblerProps) {
  return (
    <>
      {page.sections.map((section: PageSection, idx: number) => (
        <SectionRenderer key={idx} section={section} editable={editable} />
      ))}
    </>
  );
}
