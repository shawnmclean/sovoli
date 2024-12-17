"use client";

import NextImage from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@sovoli/ui/components/ui/carousel";
import { Image } from "@sovoli/ui/components/ui/image";

import supabaseLoader from "~/loaders/supabaseImageLoader";

export interface GalleryProps {
  images: { src: string; alt: string }[];
}

export function Gallery({ images }: GalleryProps) {
  if (images.length < 1) return;

  if (images.length === 1 && images[0]) {
    return (
      <Image
        src={images[0].src}
        alt={images[0].alt || "Image"}
        style={{ width: "100%", height: "auto" }}
        className="object-cover"
        width={16}
        height={9}
        as={NextImage}
        loader={supabaseLoader}
      />
    );
  }
  return (
    <Carousel className="overflow-hidden rounded-lg border border-default-200">
      <CarouselContent>
        {images.map((image, i) => (
          <CarouselItem key={i} className="flex items-center justify-center">
            <Image
              src={image.src}
              alt={image.alt || "Image"}
              className="h-auto max-h-[600px] w-auto object-contain"
              width={16}
              height={9}
              as={NextImage}
              loader={supabaseLoader}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
