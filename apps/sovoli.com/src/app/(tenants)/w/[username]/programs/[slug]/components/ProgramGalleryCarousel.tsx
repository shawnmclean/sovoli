"use client";

import type { OrgProgram } from "~/modules/academics/types";
import type { CarouselApi } from "@sovoli/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { Chip } from "@sovoli/ui/components/chip";
import Image from "next/image";
import { useState, useEffect } from "react";

export interface ProgramGalleryCarouselProps {
  program: OrgProgram;
}

export function ProgramGalleryCarousel({
  program,
}: ProgramGalleryCarouselProps) {
  const photos = program.photos ?? [];
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
                <Image
                  src={photo.url}
                  alt={`Program photo ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Counter Indicator */}
      {photos.length > 1 && (
        <div className="absolute bottom-3 right-3">
          <Chip variant="flat" color="default" radius="md">
            {current + 1} / {photos.length}
          </Chip>
        </div>
      )}
    </div>
  );
}
