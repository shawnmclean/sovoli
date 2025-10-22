"use client";

import type { OrgInstance } from "~/modules/organisations/types";
import type { CatalogItem } from "~/modules/catalogs/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { PackageIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";

export interface CatalogGroupListingProps {
  orgInstance: OrgInstance;
}

// Helper function to get category display name
const getCategoryDisplayName = (category: string) => {
  const categoryMap: Record<string, string> = {
    book: "Books",
    uniform: "Uniforms",
    material: "Materials",
    equipment: "Equipment",
    tool: "Tools",
    furniture: "Furniture",
    electronics: "Electronics",
    hygiene: "Hygiene",
    food: "Food",
    service: "Services",
  };
  return categoryMap[category] || category;
};

// Helper function to get sorting order for categories
const getCategoryOrder = (category: string) => {
  const order: Record<string, number> = {
    book: 1,
    uniform: 2,
    material: 3,
    equipment: 4,
    tool: 5,
    furniture: 6,
    electronics: 7,
    hygiene: 8,
    food: 9,
    service: 10,
  };
  return order[category] ?? 999;
};

// Helper function to format price
const formatPrice = (price: { GYD?: number }) => {
  if (price.GYD) {
    return `GYD $${price.GYD.toLocaleString()}`;
  }
  return "Price on request";
};

export function CatalogGroupListing({ orgInstance }: CatalogGroupListingProps) {
  const catalogItems = orgInstance.catalogModule?.items ?? [];

  if (catalogItems.length === 0) {
    return null;
  }

  // Group catalog items by category
  const itemsByCategory = catalogItems.reduce(
    (acc, catalogItem) => {
      const category = catalogItem.item.category;
      const categoryDisplayName = getCategoryDisplayName(category);

      if (!acc[categoryDisplayName]) {
        acc[categoryDisplayName] = [];
      }
      acc[categoryDisplayName].push(catalogItem);
      return acc;
    },
    {} as Record<string, CatalogItem[]>,
  );

  // Sort categories by order
  const sortedCategories = Object.entries(itemsByCategory).sort(
    ([a], [b]) => getCategoryOrder(a) - getCategoryOrder(b),
  );

  return (
    <div className="space-y-8">
      {sortedCategories.map(([categoryName, categoryItems]) => (
        <div key={categoryName} className="space-y-4">
          {/* Category Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <PackageIcon className="h-5 w-5" />
              {categoryName}
            </h2>
            <span className="text-sm text-muted-foreground">
              {categoryItems.length}{" "}
              {categoryItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Items Carousel */}
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {categoryItems.map((catalogItem) => {
                const itemName = catalogItem.item.name;
                const itemDescription = catalogItem.item.description;
                const itemImage = catalogItem.item.photos?.[0];

                return (
                  <CarouselItem
                    key={catalogItem.id}
                    className="pl-2 basis-[216px] shrink-0"
                  >
                    <Link
                      href={`/catalog/${catalogItem.id}`}
                      className="block w-full"
                    >
                      <Card className="overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-card h-full w-[200px] flex flex-col mr-4">
                        <div className="relative aspect-square w-full">
                          {itemImage ? (
                            <>
                              <CldImage
                                src={itemImage.publicId}
                                alt={itemName}
                                width={200}
                                height={200}
                                crop="fill"
                                sizes="200px"
                                quality="auto"
                                className="object-cover w-full h-full"
                              />
                              {/* Gradient overlay for better text readability */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <div className="text-4xl text-muted-foreground">
                                📦
                              </div>
                            </div>
                          )}
                        </div>
                        <CardBody className="p-3 flex-1 flex flex-col justify-between">
                          <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-2">
                            {itemName}
                          </h3>
                          {itemDescription && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {itemDescription}
                            </p>
                          )}
                          <div className="mt-auto">
                            <div className="text-sm font-bold text-primary">
                              {formatPrice(catalogItem.price)}
                            </div>
                            {catalogItem.item.brand && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {catalogItem.item.brand}
                              </div>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      ))}
    </div>
  );
}
