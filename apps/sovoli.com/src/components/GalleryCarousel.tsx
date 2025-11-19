"use client";

import { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import posthog from "posthog-js";
import type { CarouselApi } from "@sovoli/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { Chip } from "@sovoli/ui/components/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@sovoli/ui/components/dialog";
import { Button } from "@sovoli/ui/components/button";
import { ChevronLeftIcon } from "lucide-react";

import type { Photo } from "~/modules/core/photos/types";

export interface GalleryCarouselProps {
  photos: Photo[];
  title: string;
  emptyStateMessage?: string;
  className?: string;
}

export function GalleryCarousel({
  photos,
  title,
  emptyStateMessage = "No photos available",
  className,
}: GalleryCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const previousIndexRef = useRef(0);
  const viewedRef = useRef(false);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());

    // Track initial gallery view
    if (!viewedRef.current) {
      posthog.capture("gallery_viewed", {
        mode: "normal",
      });
      viewedRef.current = true;
    }

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      const oldIndex = previousIndexRef.current;

      // Track swipe if index changed
      if (newIndex !== oldIndex) {
        const direction = determineSwipeDirection(
          oldIndex,
          newIndex,
          photos.length,
        );
        posthog.capture("gallery_swipe", {
          mode: "normal",
          direction,
          from_index: oldIndex,
          to_index: newIndex,
        });
      }

      setCurrent(newIndex);
      previousIndexRef.current = newIndex;
    });
  }, [api, photos.length]);

  const handleOpenFullscreen = () => {
    const currentPhoto = photos[current];
    if (currentPhoto) {
      posthog.capture("gallery_open_fullscreen", {
        index: current,
        url: currentPhoto.publicId,
      });
    }
    onOpen();
  };

  if (photos.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`w-full max-w-full md:max-w-md mx-auto relative aspect-square ${className ?? ""}`}
      >
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
                    alt={photo.alt ?? `${title} photo ${index + 1}`}
                    width={448}
                    height={448}
                    crop="fill"
                    sizes="100vw"
                    quality="auto"
                    loading={index === 0 ? "eager" : "lazy"}
                    className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={handleOpenFullscreen}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {photos.length > 1 && (
          <div className="absolute bottom-6 right-3">
            <Chip
              variant="flat"
              color="default"
              radius="md"
              size="sm"
              classNames={{
                base: "bg-black/50 text-white",
              }}
            >
              {current + 1} / {photos.length}
            </Chip>
          </div>
        )}
      </div>

      <FullScreenGallery
        photos={photos}
        isOpen={isOpen}
        onClose={onClose}
        initialIndex={current}
        title={title}
      />
    </>
  );
}

function FullScreenGallery({
  photos,
  isOpen,
  onClose,
  initialIndex,
  title,
}: {
  photos: Photo[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex: number;
  title: string;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(initialIndex);
  const previousIndexRef = useRef(initialIndex);
  const imageStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());
    previousIndexRef.current = initialIndex;
    imageStartTimeRef.current = Date.now();

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      const oldIndex = previousIndexRef.current;

      // Track dwell time for the previous image
      if (oldIndex !== newIndex) {
        const dwellTime = Date.now() - imageStartTimeRef.current;
        if (dwellTime > 0) {
          // Log dwell time event for this viewing session
          posthog.capture("gallery_image_dwell_time", {
            mode: "fullscreen",
            image_index: oldIndex,
            duration_ms: dwellTime,
          });
        }

        // Track swipe
        const direction = determineSwipeDirection(
          oldIndex,
          newIndex,
          photos.length,
        );
        posthog.capture("gallery_swipe", {
          mode: "fullscreen",
          direction,
          from_index: oldIndex,
          to_index: newIndex,
        });

        // Reset timer for new image
        imageStartTimeRef.current = Date.now();
      }

      setCurrent(newIndex);
      previousIndexRef.current = newIndex;
    });
  }, [api, initialIndex, photos.length]);

  // Track final dwell time and close event when modal closes
  useEffect(() => {
    if (!isOpen && api) {
      const currentIndex = api.selectedScrollSnap();
      const currentPhoto = photos[currentIndex];

      // Track final dwell time
      const dwellTime = Date.now() - imageStartTimeRef.current;
      if (dwellTime > 0) {
        posthog.capture("gallery_image_dwell_time", {
          mode: "fullscreen",
          image_index: currentIndex,
          duration_ms: dwellTime,
        });
      }

      // Track fullscreen close
      posthog.capture("gallery_close_fullscreen", {
        index: currentIndex,
        url: currentPhoto?.publicId,
      });
    }
  }, [isOpen, api, photos]);

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
                      alt={photo.alt ?? `${title} photo ${index + 1}`}
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

function determineSwipeDirection(
  fromIndex: number,
  toIndex: number,
  totalItems: number,
): "left" | "right" {
  // Handle wrap-around for loop carousels
  if (fromIndex === totalItems - 1 && toIndex === 0) {
    return "right";
  }
  if (fromIndex === 0 && toIndex === totalItems - 1) {
    return "left";
  }

  // Normal case
  return toIndex > fromIndex ? "right" : "left";
}
