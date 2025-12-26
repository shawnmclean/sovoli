import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { loadMDXDoc } from "../lib/loadDoc";
import type { DocSection } from "../lib/types";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

function isValidSection(section: string): section is DocSection {
  return section === "guides" || section === "reference";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;

  // Handle root /docs
  if (slug.length === 0) {
    return {
      title: "Learn more about how to use Sovoli",
      description: "Documentation and guides for using Sovoli",
    };
  }

  const section = slug[0];
  if (!section || !isValidSection(section)) {
    return {
      title: "Not Found",
    };
  }

  const docSlug = slug.slice(1);

  // Load the MDX doc to get metadata
  const doc = await loadMDXDoc(section, docSlug);

  if (!doc) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: `${doc.metadata.title} | Docs`,
    description: doc.metadata.description,
  };
}

export default async function DocPage({ params }: Props) {
  const { slug = [] } = await params;

  // Handle root /docs - show landing page
  if (slug.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col py-12">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
            <p className="text-lg text-default-600 mt-2">
              Guides and reference documentation for using Sovoli
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/docs/guides"
              className="p-6 border border-default-200 rounded-lg hover:bg-default-50 transition-colors block"
            >
              <h2 className="text-xl font-semibold mb-2">Guides</h2>
              <p className="text-default-600">
                Step-by-step guides to help you get started
              </p>
            </Link>
            <Link
              href="/docs/reference"
              className="p-6 border border-default-200 rounded-lg hover:bg-default-50 transition-colors block"
            >
              <h2 className="text-xl font-semibold mb-2">Reference</h2>
              <p className="text-default-600">
                Reference documentation and specifications
              </p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const section = slug[0];
  if (!section || !isValidSection(section)) {
    notFound();
  }

  const docSlug = slug.slice(1);

  // Load the MDX doc
  const doc = await loadMDXDoc(section, docSlug);

  if (!doc) {
    notFound();
  }

  const MDXContent = doc.content;

  return (
    <article className="prose prose-slate max-w-none">
      <MDXContent />
    </article>
  );
}
