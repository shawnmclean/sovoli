import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface CatalogPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: CatalogPageProps): Promise<Metadata> {
  const { username } = await params;
  const {
    websiteModule: { website },
  } = await retrieveOrgInstance(username);

  return {
    title: "Catalog",
    description: `Browse our catalog of items and supplies at ${website.siteName}.`,
    keywords: ["catalog", "supplies", "items", "pricing", website.siteName],
    openGraph: {
      title: `Catalog | ${website.siteName}`,
      description: `Browse our catalog of items and supplies at ${website.siteName}.`,
      type: "website",
      url: "/catalog",
      siteName: website.siteName,
      images: [
        {
          url: `/catalog/opengraph-image?t=${Date.now()}`,
          width: 1200,
          height: 600,
          alt: "Catalog",
        },
      ],
    },
  };
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const { username } = await params;

  const orgInstance = await retrieveOrgInstance(username);

  const catalogItems = orgInstance.catalogModule?.items ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Product Catalog
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive range of quality products and supplies
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {catalogItems.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-medium text-foreground mb-2">
                No products available
              </h3>
              <p className="text-muted-foreground">
                We're currently updating our catalog. Please check back soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {catalogItems.map((catalogItem) => (
              <div
                key={catalogItem.id}
                className="group bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
              >
                {/* Product Details */}
                <div className="p-4 sm:p-5">
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {catalogItem.item.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {catalogItem.item.name}
                  </h3>

                  {catalogItem.item.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {catalogItem.item.description}
                    </p>
                  )}

                  {/* Price */}
                  {catalogItem.price.GYD && (
                    <div className="mt-3">
                      <span className="text-xl font-bold text-foreground">
                        GYD ${catalogItem.price.GYD.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
