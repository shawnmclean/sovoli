import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";
import { ProductCatalogListing } from "./components/ProductCatalogListing";
import { SupplyListHeader } from "./components/SupplyListHeader";
import { SupplyListResults } from "./components/SupplyListResults";
import { getProgramRequirements } from "./lib/getProgramRequirements";
import { mapRequirementsToCatalog } from "./lib/mapRequirementsToCatalog";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface CatalogPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ school: string; program: string }>;
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

export default async function CatalogPage({
  params,
  searchParams,
}: CatalogPageProps) {
  const { username } = await params;
  const { school, program } = await searchParams;

  const orgInstance = await retrieveOrgInstance(username);
  const catalogItems = orgInstance.catalogModule?.items ?? [];

  // If school and program query params are present, show program search results
  if (school && program) {
    console.log("school", school);
    // Get program requirements server-side
    const programData = getProgramRequirements(school, program);

    if (!programData.school || !programData.program) {
      return (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="text-center py-16 sm:py-24">
              <div className="mx-auto max-w-md">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Program not found
                </h3>
                <p className="text-muted-foreground">
                  The requested program could not be found.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Map requirements to catalog items
    const matchedItems = mapRequirementsToCatalog(
      programData.requirements,
      catalogItems,
    );

    return (
      <div className="min-h-screen bg-background">
        <SupplyListHeader
          school={programData.school}
          program={programData.program}
        />
        <SupplyListResults
          school={programData.school}
          program={programData.program}
          requirements={programData.requirements}
          matchedItems={matchedItems}
        />
      </div>
    );
  }

  // Otherwise, show the regular product catalog listing
  return <ProductCatalogListing catalogItems={catalogItems} />;
}
