"use client";

import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export interface GalleryProps {
  images: { src: string; alt: string }[];
}

export function Gallery({ images }: GalleryProps) {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {images.map((image, i) => (
          <CarouselItem key={i}>
            <div className="relative h-64 w-full p-1">
              {" "}
              {/* Set height for aspect ratio */}
              <Image
                src={image.src}
                alt={image.alt || "Image"}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
