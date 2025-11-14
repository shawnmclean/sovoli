"use client";

import { useEffect, useState } from "react";
import type { CarouselApi } from "@sovoli/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

import type { Photo } from "~/modules/core/photos/types";

interface ProjectCarouselProps {
  photos: Photo[];
  title: string;
  href: string;
}

export function ProjectCarousel({ photos, title, href }: ProjectCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (photos.length === 0) {
    return (
      <div className="flex min-h-[320px] w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500">
        Photos coming soon
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[320px]">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="h-full w-full"
      >
        <CarouselContent className="h-full -ml-0">
          {photos.map((photo, index) => (
            <CarouselItem
              key={`${title}-${index}`}
              className="h-full basis-full pl-0"
            >
              <Link
                href={href}
                className="relative block w-full min-h-[320px] overflow-hidden rounded-2xl"
                aria-label={`Open project ${title}`}
              >
                <CldImage
                  src={photo.publicId}
                  alt={photo.alt ?? `${title} photo ${index + 1}`}
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

      {photos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {Array.from({ length: Math.min(5, photos.length) }, (_, dotIndex) => {
            let slideIndex: number;
            if (photos.length <= 5) {
              slideIndex = dotIndex;
            } else if (current < 2) {
              slideIndex = dotIndex;
            } else if (current >= photos.length - 2) {
              slideIndex = photos.length - 5 + dotIndex;
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
