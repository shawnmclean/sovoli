import type { CatalogOffer } from "~/modules/catalogs/types";

export interface CatalogItemPricingSectionProps {
  catalogItem: CatalogOffer;
}

export const CatalogItemPricingSection = ({
  catalogItem,
}: CatalogItemPricingSectionProps) => {
  const price = catalogItem.price;

  // Format price checking all currencies (JMD, GYD, USD)
  const prices: string[] = [];
  if (typeof price.JMD === "number") {
    prices.push(`JMD $${price.JMD.toLocaleString()}`);
  }
  if (typeof price.GYD === "number") {
    prices.push(`GYD $${price.GYD.toLocaleString()}`);
  }
  if (typeof price.USD === "number") {
    prices.push(`USD $${price.USD.toLocaleString()}`);
  }
  const hasPrice = prices.length > 0;

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Pricing</h2>

      <div className="bg-card rounded-lg p-6 border border-default-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {hasPrice ? prices.join(" • ") : "Price on request"}
          </div>
          <p className="text-sm text-muted-foreground">
            {hasPrice
              ? "Price includes all applicable taxes"
              : "Contact us for pricing"}
          </p>
        </div>
      </div>
    </section>
  );
};
