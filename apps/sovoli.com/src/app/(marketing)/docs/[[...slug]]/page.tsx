import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { DocsNavbar } from "../components/DocsNavbar";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ["guides"] },
    { slug: ["guides", "ads"] },
    { slug: ["guides", "whatsapp"] },
    { slug: ["guides", "whatsapp", "new-business"] },
    { slug: ["reference"] },
    { slug: ["reference", "supported-countries"] },
  ];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;

  if (slug.length === 0) {
    return {
      title: "Documentation | Sovoli",
      description: "Documentation and guides for using Sovoli",
    };
  }

  const key = slug.join("/");
  const importMap: Record<string, () => Promise<unknown>> = {
    guides: () => import("../_content/guides/index.mdx"),
    "guides/ads": () => import("../_content/guides/ads/index.mdx"),
    "guides/whatsapp": () => import("../_content/guides/whatsapp/index.mdx"),
    "guides/whatsapp/new-business": () =>
      import("../_content/guides/whatsapp/new-business.mdx"),
    reference: () => import("../_content/reference/index.mdx"),
    "reference/supported-countries": () =>
      import("../_content/reference/supported-countries.mdx"),
  };

  const importFn = importMap[key];
  if (!importFn) {
    return { title: "Not Found" };
  }

  try {
    const mdxModule = (await importFn()) as {
      metadata?: { title: string; description: string };
    };
    if (mdxModule.metadata) {
      return {
        title: `${mdxModule.metadata.title} | Docs`,
        description: mdxModule.metadata.description,
      };
    }
  } catch (error) {
    console.error(
      `[generateMetadata] Error loading ${key}:`,
      error instanceof Error ? error.message : String(error),
    );
  }

  return { title: "Not Found" };
}

export default async function DocPage({ params }: Props) {
  const { slug = [] } = await params;

  if (slug.length === 0) {
    return (
      <>
        <DocsNavbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex min-h-[60vh] flex-col py-12">
              <div className="w-full space-y-8">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    Documentation
                  </h1>
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
          </div>
        </main>
      </>
    );
  }

  const key = slug.join("/");
  const importMap: Record<string, () => Promise<unknown>> = {
    guides: () => import("../_content/guides/index.mdx"),
    "guides/ads": () => import("../_content/guides/ads/index.mdx"),
    "guides/whatsapp": () => import("../_content/guides/whatsapp/index.mdx"),
    "guides/whatsapp/new-business": () =>
      import("../_content/guides/whatsapp/new-business.mdx"),
    reference: () => import("../_content/reference/index.mdx"),
    "reference/supported-countries": () =>
      import("../_content/reference/supported-countries.mdx"),
  };

  const importFn = importMap[key];
  if (!importFn) {
    notFound();
  }

  try {
    const mdxModule = (await importFn()) as {
      default?: React.ComponentType;
      metadata?: { title: string; description: string };
    };
    if (mdxModule.default) {
      return (
        <>
          <DocsNavbar title={mdxModule.metadata?.title ?? "Documentation"} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <article className="prose prose-slate max-w-none">
                <mdxModule.default />
              </article>
            </div>
          </main>
        </>
      );
    }
  } catch (error) {
    console.error(
      `[DocPage] Error loading ${key}:`,
      error instanceof Error ? error.message : String(error),
    );
  }

  notFound();
}
