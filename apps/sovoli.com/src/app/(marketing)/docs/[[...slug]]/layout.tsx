import { DocsNavbar } from "../components/DocsNavbar";
import { loadMDXDoc } from "../lib/loadDoc";
import type { DocSection } from "../lib/types";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug?: string[] }>;
}

function isValidSection(section: string): section is DocSection {
  return section === "guides" || section === "reference";
}

export default async function DocsSlugLayout({ children, params }: Props) {
  const { slug = [] } = await params;
  let title: string | undefined;

  // Only try to load doc title if we have a slug (not on root /docs)
  if (slug.length > 0) {
    const section = slug[0];
    if (section && isValidSection(section)) {
      const docSlug = slug.slice(1);
      const doc = await loadMDXDoc(section, docSlug);
      if (doc) {
        title = doc.metadata.title;
      }
    }
  }

  return (
    <>
      <DocsNavbar title={title} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </>
  );
}
