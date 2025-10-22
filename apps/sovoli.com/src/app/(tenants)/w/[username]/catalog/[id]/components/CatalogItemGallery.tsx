import type { CatalogItem } from "~/modules/catalogs/types";
import { CldImage } from "next-cloudinary";

export interface CatalogItemGalleryProps {
  catalogItem: CatalogItem;
}

export const CatalogItemGallery = ({
  catalogItem,
}: CatalogItemGalleryProps) => {
  const photos = catalogItem.item.photos ?? [];

  if (photos.length === 0) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <div className="text-6xl text-muted-foreground">📦</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {photos.length === 1 ? (
        <div className="relative aspect-square w-full">
          <CldImage
            src={photos[0]?.publicId ?? ""}
            alt={catalogItem.item.name}
            width={800}
            height={800}
            crop="fill"
            sizes="(max-width: 768px) 100vw, 800px"
            quality="auto"
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photos.slice(0, 4).map((photo, index) => (
            <div key={photo.publicId} className="relative aspect-square">
              <CldImage
                src={photo.publicId}
                alt={`${catalogItem.item.name} - Image ${index + 1}`}
                width={400}
                height={400}
                crop="fill"
                sizes="(max-width: 768px) 100vw, 400px"
                quality="auto"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
