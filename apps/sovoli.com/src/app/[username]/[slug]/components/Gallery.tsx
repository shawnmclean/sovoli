"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@sovoli/ui/components/carousel";

import supabaseLoader from "~/loaders/supabaseImageLoader";

export interface GalleryProps {
  images: { src: string; alt: string }[];
}

export function Gallery({ images }: GalleryProps) {
  if (images.length < 1) return;

  if (images.length === 1 && images[0]) {
    return (
      <div className="relative h-[500px] w-[100%]">
        <Image
          src={images[0].src}
          alt={images[0].alt || "Image"}
          className="object-contain"
          fill
          loader={supabaseLoader}
        />
      </div>
    );
  }
  return (
    <Carousel className="overflow-hidden rounded-lg border border-default-200">
      <CarouselContent>
        {images.map((image, i) => (
          <CarouselItem key={i} className="flex items-center justify-center">
            <div className="relative h-[500px] w-[100%]">
              <Image
                src={image.src}
                alt={image.alt || "Image"}
                className="object-contain"
                fill
                loader={supabaseLoader}
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
