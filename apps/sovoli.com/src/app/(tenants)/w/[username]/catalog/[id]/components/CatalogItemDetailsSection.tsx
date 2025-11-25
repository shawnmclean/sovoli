import type { CatalogOffer } from "~/modules/catalogs/types";

export interface CatalogItemDetailsSectionProps {
  catalogItem: CatalogOffer;
}

export const CatalogItemDetailsSection = ({
  catalogItem,
}: CatalogItemDetailsSectionProps) => {
  const item = catalogItem.item;

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Product Details
      </h2>

      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Category</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {item.category.name}
            </p>
          </div>

          {item.brand && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Brand</h3>
              <p className="text-sm text-muted-foreground">{item.brand}</p>
            </div>
          )}

          {item.modelNumber && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Model Number
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.modelNumber}
              </p>
            </div>
          )}

          {item.unitLabel && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Unit</h3>
              <p className="text-sm text-muted-foreground">{item.unitLabel}</p>
            </div>
          )}
        </div>

        {/* Physical Information */}
        {(item.dimensions ?? item.weightInGrams) && (
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              Physical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.dimensions && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Dimensions: {item.dimensions.lengthCm}cm ×{" "}
                    {item.dimensions.widthCm}cm × {item.dimensions.heightCm}cm
                  </p>
                </div>
              )}
              {item.weightInGrams && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Weight: {item.weightInGrams}g
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attributes */}
        {item.attributes && Object.keys(item.attributes).length > 0 && (
          <div>
            <h3 className="font-semibold text-foreground mb-2">Attributes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(item.attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </span>
                  <span className="text-sm text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div>
            <h3 className="font-semibold text-foreground mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
