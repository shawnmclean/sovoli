import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";
import { SectionRenderer } from "./SectionRenderer";

interface PageAssemblerProps {
  pageName: string;
  orgInstance: OrgInstanceWithWebsite;
}

export function PageAssembler({ pageName, orgInstance }: PageAssemblerProps) {
  const page = orgInstance.websiteModule.website.pages.find(
    (page) => page.name === pageName,
  );

  if (!page) {
    return null;
  }

  return (
    <>
      {page.sections.map((section, idx) => (
        <SectionRenderer
          key={idx}
          section={section}
          orgInstance={orgInstance}
        />
      ))}
    </>
  );
}
