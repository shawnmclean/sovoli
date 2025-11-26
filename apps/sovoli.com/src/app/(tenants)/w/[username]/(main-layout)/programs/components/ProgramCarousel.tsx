"use client";

import type { Program } from "~/modules/academics/types";
import type { CarouselApi } from "@sovoli/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

export interface ProgramCarouselProps {
  href: string;
  program: Program;
}

export function ProgramCarousel({ href, program }: ProgramCarouselProps) {
  const photos = program.media ?? [];
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (photos.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 text-sm">No photos available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full h-full"
      >
        <CarouselContent className="h-full -ml-0">
          {photos.map((photo, index) => (
            <CarouselItem key={index} className="basis-full pl-0 h-full">
              <div className="w-full h-full aspect-square relative">
                <Link href={href}>
                  <CldImage
                    src={photo.publicId}
                    fill
                    alt={`Program photo ${index + 1}`}
                    className="object-cover rounded-lg"
                  />
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots Indicator */}
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Array.from({ length: Math.min(5, photos.length) }, (_, i) => {
            let slideIndex;
            if (photos.length <= 5) {
              // If 5 or fewer photos, show all dots
              slideIndex = i;
            } else if (current < 2) {
              // Near the beginning, show first 5
              slideIndex = i;
            } else if (current >= photos.length - 2) {
              // Near the end, show last 5
              slideIndex = photos.length - 5 + i;
            } else {
              // In the middle, show dots around current position
              slideIndex = current - 2 + i;
            }

            return (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  current === slideIndex
                    ? "bg-white scale-120 shadow-lg"
                    : "bg-white/60"
                }`}
                aria-label={`Slide ${slideIndex + 1} of ${photos.length}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
