import type { CatalogItem } from "~/modules/catalogs/types";
import type { OrgInstance } from "~/modules/organisations/types";

export interface CatalogItemHeroSectionProps {
  orgInstance: OrgInstance;
  catalogItem: CatalogItem;
}

export const CatalogItemHeroSection = ({
  orgInstance,
  catalogItem,
}: CatalogItemHeroSectionProps) => {
  const org = orgInstance.org;
  const itemName = catalogItem.item.name;
  const itemDescription = catalogItem.item.description;
  const itemCategory = catalogItem.item.category;
  const itemBrand = catalogItem.item.brand;
  const price = catalogItem.price;

  // Get primary location
  const primaryLocation = org.locations.find((loc) => loc.isPrimary);

  return (
    <section className="my-6 border-b border-default-200 pb-6 text-center">
      {/* Item Name */}
      <h1 className="text-2xl leading-tight tracking-tight my-4">{itemName}</h1>

      {/* Price */}
      {price.GYD && (
        <div className="mb-4">
          <div className="text-3xl font-bold text-primary">
            GYD ${price.GYD.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            Price includes all applicable taxes
          </p>
        </div>
      )}

      {/* Category and Brand */}
      <div className="flex justify-center gap-4 text-sm text-muted-foreground mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {itemCategory}
        </span>
        <span className="text-muted-foreground">by {itemBrand}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-foreground-500 max-w-3xl mx-auto mb-4">
        {itemDescription}
      </p>

      {/* Primary Location */}
      {primaryLocation && (
        <div className="flex justify-center gap-2 text-foreground-500">
          <span className="text-sm">
            Available at {primaryLocation.address.city}
          </span>
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-4">
        ✅ Quality guaranteed
      </p>
    </section>
  );
};
