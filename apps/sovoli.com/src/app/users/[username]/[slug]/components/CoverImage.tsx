"use client";

import { CldImage } from "next-cloudinary";

interface CoverImageProps {
  bucket: string;
  id: string;
  alt: string;
}

export function CoverImage({ bucket, id, alt }: CoverImageProps) {
  return (
    <div className="mb-8 relative h-64 rounded-lg overflow-hidden bg-default-100">
      <CldImage
        src={`${bucket}/${id}`}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
