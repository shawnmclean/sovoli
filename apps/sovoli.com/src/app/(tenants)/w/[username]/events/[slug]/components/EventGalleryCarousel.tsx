"use client";

import type { Event } from "~/modules/events/types";
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
  ModalHeader,
} from "@sovoli/ui/components/dialog";
import { CldImage } from "next-cloudinary";
import { useState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import { ChevronLeftIcon } from "lucide-react";
import type { Photo } from "~/modules/core/photos/types";

export interface EventGalleryCarouselProps {
  event: Event;
}

// Modal Component
function EventGalleryModal({
  photos,
  isOpen,
  onClose,
  initialIndex = 0,
}: {
  photos: Photo[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="full" hideCloseButton>
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <Button variant="light" isIconOnly radius="full" onPress={onClose}>
            <ChevronLeftIcon />
          </Button>
          <span className="text-sm">
            {current + 1} / {photos.length}
          </span>
        </ModalHeader>
        <ModalBody className="p-0 flex-1 overflow-hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              startIndex: initialIndex,
            }}
            setApi={setApi}
            className="w-full h-full"
          >
            <CarouselContent className="h-full -ml-0">
              {photos.map((photo, index) => (
                <CarouselItem key={index} className="basis-full pl-0 h-full">
                  <div className="w-full h-full relative flex items-center justify-center">
                    <CldImage
                      src={photo.publicId}
                      alt={photo.alt ?? `Event photo ${index + 1}`}
                      width={photo.width}
                      height={photo.height}
                      sizes="100vw"
                      className="object-contain"
                      priority
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function EventGalleryCarousel({ event }: EventGalleryCarouselProps) {
  const photos = event.photos ?? [];
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
      <div className="w-full h-full bg-content2 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No photos available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full md:max-w-md mx-auto relative aspect-square">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0">
          {photos.map((photo, index) => (
            <CarouselItem key={index} className="basis-full pl-0">
              <div className="w-full max-w-md aspect-square mx-auto relative">
                <CldImage
                  src={photo.publicId}
                  priority={index === 0}
                  alt={photo.alt ?? `Event photo ${index + 1}`}
                  width={448}
                  height={448}
                  crop="fill"
                  sizes="100vw"
                  quality="auto"
                  loading={index === 0 ? "eager" : "lazy"}
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
          <Chip
            variant="flat"
            color="default"
            radius="md"
            size="sm"
            classNames={{
              base: "bg-foreground/50 text-background",
            }}
          >
            {current + 1} / {photos.length}
          </Chip>
        </div>
      )}

      {/* Full Screen Modal */}
      <EventGalleryModal
        photos={photos}
        isOpen={isOpen}
        onClose={onClose}
        initialIndex={current}
      />
    </div>
  );
}
