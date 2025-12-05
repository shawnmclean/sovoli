"use client";

import { useEffect, useState, useTransition } from "react";
import type { CarouselApi } from "@sovoli/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

import type { Media } from "~/modules/core/media/types";

interface ProjectCarouselProps {
  media: Media[];
  title: string;
  href: string;
}

export function ProjectCarousel({
  media: photos,
  title,
  href,
}: ProjectCarouselProps) {
  // Filter to only show images - exclude videos, PDFs and other documents
  const images = photos.filter((media) => media.type === "image");

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!api) return;
    startTransition(() => {
      setCurrent(api.selectedScrollSnap());
    });
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (images.length === 0) {
    return (
      <div className="flex min-h-[320px] w-full items-center justify-center bg-muted text-sm text-muted-foreground">
        Photos coming soon
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[320px] overflow-hidden rounded-2xl">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="h-full w-full"
      >
        <CarouselContent className="h-full -ml-0">
          {images.map((media, index) => (
            <CarouselItem
              key={`${title}-${index}`}
              className="h-full basis-full pl-0"
            >
              <Link
                href={href}
                className="relative block w-full min-h-[320px] overflow-hidden"
                aria-label={`Open project ${title}`}
              >
                <CldImage
                  src={media.publicId}
                  alt={media.alt ?? `${title} photo ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="h-full w-full object-cover"
                  priority={index === 0}
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {Array.from({ length: Math.min(5, images.length) }, (_, dotIndex) => {
            let slideIndex: number;
            if (images.length <= 5) {
              slideIndex = dotIndex;
            } else if (current < 2) {
              slideIndex = dotIndex;
            } else if (current >= images.length - 2) {
              slideIndex = images.length - 5 + dotIndex;
            } else {
              slideIndex = current - 2 + dotIndex;
            }

            return (
              <span
                key={`${title}-dot-${dotIndex}`}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  current === slideIndex
                    ? "scale-125 bg-white shadow-lg"
                    : "bg-white/60"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
