interface CatalogItemCardProps {
  item: {
    id: string;
    item: {
      name: string;
      description?: string;
      category: string;
    };
    price: {
      GYD?: number;
    };
  };
}

function CatalogItemCard({ item }: CatalogItemCardProps) {
  return (
    <div className="group bg-card rounded-xl shadow-xs hover:shadow-lg transition-all duration-200">
      <div className="p-4 sm:p-5">
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {item.item.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {item.item.name}
        </h3>

        {item.item.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {item.item.description}
          </p>
        )}

        {item.price.GYD && (
          <div className="mt-3">
            <span className="text-xl font-bold text-foreground">
              GYD ${item.price.GYD.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCatalogListingProps {
  catalogItems: {
    id: string;
    item: {
      name: string;
      description?: string;
      category: string;
    };
    price: {
      GYD?: number;
    };
  }[];
}

export function ProductCatalogListing({
  catalogItems,
}: ProductCatalogListingProps) {
  // Calculate summary statistics
  const totalItems = catalogItems.length;
  const categories = [
    ...new Set(catalogItems.map((item) => item.item.category)),
  ];
  const categoryCount = categories.length;
  const categoryBreakdown = categories.map((category) => ({
    name: category,
    count: catalogItems.filter((item) => item.item.category === category)
      .length,
  }));

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

      {/* Summary Section */}
      {totalItems > 0 && (
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {totalItems}
                  </span>
                  <span className="text-muted-foreground">
                    {totalItems === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">
                    {categoryCount}
                  </span>
                  <span className="text-muted-foreground">
                    {categoryCount === 1 ? "category" : "categories"}
                  </span>
                </div>
              </div>

              {/* Category Breakdown */}
              {categoryBreakdown.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categoryBreakdown.map((category) => (
                    <span
                      key={category.name}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                    >
                      {category.name} ({category.count})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {totalItems === 0 ? (
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
              <CatalogItemCard key={catalogItem.id} item={catalogItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
