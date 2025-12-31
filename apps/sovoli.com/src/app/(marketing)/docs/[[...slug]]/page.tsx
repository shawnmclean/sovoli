import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { config } from "~/utils/config";
import { DocsNavbar } from "../components/DocsNavbar";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

interface MDXModule {
  default?: React.ComponentType;
  metadata?: {
    title: string;
    description: string;
  };
}

async function getPage(slug: string[]): Promise<MDXModule | null> {
  if (slug.length === 0) {
    return null;
  }

  const key = slug.join("/");
  try {
    const mdxModule = (await import(
      `../_content/${key}/index.mdx`
    )) as MDXModule;
    return mdxModule;
  } catch (error) {
    console.error(
      `[getPage] Error loading ${key}:`,
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ["guides"] },
    { slug: ["guides", "ads"] },
    { slug: ["guides", "verification"] },
    { slug: ["guides", "whatsapp"] },
    { slug: ["guides", "whatsapp", "new-business"] },
    { slug: ["guides", "whatsapp", "new-business", "guyana"] },
    { slug: ["guides", "whatsapp", "new-business", "jamaica"] },
    { slug: ["reference"] },
    { slug: ["reference", "supported-countries"] },
  ];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;

  if (slug.length === 0) {
    const title = "Documentation | Sovoli";
    const description = "Documentation and guides for using Sovoli";
    const url = `${config.url}/docs`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url,
        siteName: config.siteName,
        images: config.images,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: config.images.map((img) => img.url),
      },
    };
  }

  const mdxModule = await getPage(slug);
  if (mdxModule?.metadata) {
    const title = `${mdxModule.metadata.title} | Docs`;
    const description = mdxModule.metadata.description;
    const url = `${config.url}/docs/${slug.join("/")}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        url,
        siteName: config.siteName,
        images: config.images,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: config.images.map((img) => img.url),
      },
    };
  }

  return { title: "Not Found" };
}

export default async function Page({ params }: Props) {
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

  const mdxModule = await getPage(slug);
  if (!mdxModule?.default) {
    notFound();
  }

  const { default: Post } = mdxModule;

  return (
    <>
      <DocsNavbar title={mdxModule.metadata?.title ?? "Documentation"} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-slate max-w-none">
            <Post />
          </article>
        </div>
      </main>
    </>
  );
}
