"use client";

import type { OrgProgram } from "~/modules/academics/types";
import type { CarouselApi } from "@sovoli/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { Chip } from "@sovoli/ui/components/chip";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@sovoli/ui/components/dialog";
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
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
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
                  className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={onOpen}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Counter Indicator */}
      {photos.length > 1 && (
        <div className="absolute bottom-6 right-3">
          <Chip variant="flat" color="default" radius="md">
            {current + 1} / {photos.length}
          </Chip>
        </div>
      )}

      {/* Full Screen Modal */}
      <Modal isOpen={isOpen} onOpenChange={onClose} size="full">
        <ModalContent className="flex flex-col h-screen max-h-screen bg-black/95">
          <ModalBody className="p-0 flex-1 overflow-hidden">
            <div className="w-full h-full relative flex items-center justify-center">
              <Image
                src={photos[current]?.url ?? ""}
                alt={`Program photo ${current + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
