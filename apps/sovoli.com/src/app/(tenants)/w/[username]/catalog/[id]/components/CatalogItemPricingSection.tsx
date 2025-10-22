import type { CatalogItem } from "~/modules/catalogs/types";

export interface CatalogItemPricingSectionProps {
  catalogItem: CatalogItem;
}

export const CatalogItemPricingSection = ({
  catalogItem,
}: CatalogItemPricingSectionProps) => {
  const price = catalogItem.price;

  const formatPrice = (price: { GYD?: number }) => {
    if (price.GYD) {
      return `GYD $${price.GYD.toLocaleString()}`;
    }
    return "Price on request";
  };

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Pricing</h2>

      <div className="bg-card rounded-lg p-6 border border-default-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {formatPrice(price)}
          </div>
          <p className="text-sm text-muted-foreground">
            {price.GYD
              ? "Price includes all applicable taxes"
              : "Contact us for pricing"}
          </p>
        </div>

        {price.GYD && (
          <div className="mt-4 text-center">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
