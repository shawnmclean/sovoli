import { notFound } from "next/navigation";
import { Footer } from "../../components/footer/Footer";
import type { Product, WithContext } from "schema-dts";
import type { OrgInstanceWithWebsite } from "../../lib/types";

import { getOrgInstanceWithCatalogItem } from "./lib/getOrgInstanceWithCatalogItem";
import { Alert } from "@sovoli/ui/components/alert";
import { CatalogItemHeroSection } from "./components/CatalogItemHeroSection";
import { CatalogItemDetailsSection } from "./components/CatalogItemDetailsSection";
import { CatalogItemPricingSection } from "./components/CatalogItemPricingSection";
import { CatalogItemGallery } from "./components/CatalogItemGallery";

const retrieveOrgInstanceWithCatalogItem = async (
  username: string,
  catalogItemId: string,
) => {
  const result = await getOrgInstanceWithCatalogItem(username, catalogItemId);
  if (!result) return notFound();
  return result;
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string; id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username, id } = await params;
  const { orgInstance, catalogItem } = await retrieveOrgInstanceWithCatalogItem(
    username,
    id,
  );

  const website = orgInstance.websiteModule?.website;

  const itemName = catalogItem.item.name;
  const itemDescription = catalogItem.item.description ?? "";

  return {
    title: itemName,
    description: itemDescription,
    openGraph: {
      title: `${itemName} | ${website?.siteName ?? "Catalog"}`,
      description: itemDescription,
      type: "website",
      images: [
        {
          url: catalogItem.item.photos?.[0]?.url ?? "",
          width: 1200,
          height: 630,
          alt: itemName,
        },
      ],
    },
  };
}

export default async function Layout({ children, params }: Props) {
  const { username, id } = await params;
  const { orgInstance, catalogItem } = await retrieveOrgInstanceWithCatalogItem(
    username,
    id,
  );

  // Build structured data for the product
  const productSchema: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: catalogItem.item.name,
    description: catalogItem.item.description,
    brand: catalogItem.item.brand
      ? {
          "@type": "Brand",
          name: catalogItem.item.brand,
        }
      : undefined,
    category: catalogItem.item.category,
    ...(catalogItem.item.photos?.[0]?.url && {
      image: catalogItem.item.photos[0]?.url,
    }),
    offers: {
      "@type": "Offer",
      price: catalogItem.price.GYD ?? 0,
      priceCurrency: "GYD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema, null, 0),
        }}
      />
      <Alert
        className="hidden md:flex"
        variant="flat"
        color="warning"
        title="Website optimized for mobile devices. Use your phone please."
      />

      <CatalogItemGallery catalogItem={catalogItem} />

      <div className="container mx-auto max-w-7xl px-4">
        <CatalogItemHeroSection
          orgInstance={orgInstance}
          catalogItem={catalogItem}
        />

        <CatalogItemDetailsSection catalogItem={catalogItem} />

        <CatalogItemPricingSection catalogItem={catalogItem} />
      </div>

      {children}
      {orgInstance.websiteModule && (
        <Footer orgInstance={orgInstance as OrgInstanceWithWebsite} />
      )}
    </div>
  );
}
