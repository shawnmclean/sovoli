"use client";

import { Card, CardBody } from "@sovoli/ui/components/card";
import { CldImage } from "next-cloudinary";
import type { Media } from "~/modules/core/media/types";

// Type guard for inline photo (only images for inline display)
function hasInlinePhoto(
  media: Media,
): media is Media & { type: "image"; bucket: string; id: string } {
  return media.type === "image" && !!(media.bucket && media.id);
}

interface InlinePhotosProps {
  photos: Media[];
}

export function InlinePhotos({ photos }: InlinePhotosProps) {
  // Filter to only show images inline (videos can be displayed differently if needed)
  const validPhotos = photos.filter(hasInlinePhoto);

  if (validPhotos.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">Photos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {validPhotos.map((photo) => (
          <Card key={photo.id} className="p-4">
            <CardBody className="p-0">
              <div className="relative h-48 rounded mb-2 overflow-hidden bg-default-100">
                <CldImage
                  src={`${photo.bucket}/${photo.id}`}
                  alt={photo.alt ?? ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="text-sm font-medium text-foreground">
                {photo.caption ?? photo.alt}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
