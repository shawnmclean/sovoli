"use client";

import { CldImage } from "next-cloudinary";
import type { Photo } from "~/modules/core/photos/types";

// Type guard for inline photo
function hasInlinePhoto(
  photo: Photo,
): photo is Photo & { bucket: string; id: string } {
  return !!(photo.bucket && photo.id);
}

interface InlinePhotosProps {
  photos: Photo[];
}

export function InlinePhotos({ photos }: InlinePhotosProps) {
  const validPhotos = photos.filter(hasInlinePhoto);

  if (validPhotos.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {validPhotos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="relative h-48 rounded mb-2 overflow-hidden">
              <CldImage
                src={`${photo.bucket}/${photo.id}`}
                alt={photo.alt ?? ""}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="text-sm font-medium text-gray-900">
              {photo.caption ?? photo.alt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
