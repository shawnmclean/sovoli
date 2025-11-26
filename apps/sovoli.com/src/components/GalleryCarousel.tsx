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

import type { Media } from "~/modules/core/media/types";
import { filterVisualMedia } from "~/modules/core/media/types";

export interface GalleryCarouselProps {
  media: Media[];
  title: string;
  emptyStateMessage?: string;
  className?: string;
  type: "project" | "program" | "event";
  id: string;
  username: string;
}

export function GalleryCarousel({
  media: photos,
  title,
  emptyStateMessage = "No media available",
  className,
  type,
  id,
  username,
}: GalleryCarouselProps) {
  // Filter to only show visual media (images and videos) - exclude PDFs and other documents
  const visualMedia = filterVisualMedia(photos);

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
      posthog.capture("GalleryViewed", {
        mode: "normal",
        total_items: visualMedia.length,
        type,
        id,
        username,
        title,
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
          visualMedia.length,
        );
        posthog.capture("GallerySwipe", {
          mode: "normal",
          direction,
          from_index: oldIndex,
          to_index: newIndex,
          total_items: visualMedia.length,
          type,
          id,
          username,
          title,
        });
      }

      setCurrent(newIndex);
      previousIndexRef.current = newIndex;
    });
  }, [api, visualMedia.length, type, id, username, title]);

  const handleOpenFullscreen = () => {
    const currentMedia = visualMedia[current];
    if (currentMedia) {
      posthog.capture("GalleryOpenFullscreen", {
        index: current,
        url: currentMedia.publicId,
        media_type: currentMedia.type,
        total_items: visualMedia.length,
        type,
        id,
        username,
        title,
      });
    }
    onOpen();
  };

  if (visualMedia.length === 0) {
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
            {visualMedia.map((media, index) => (
              <CarouselItem key={index} className="basis-full pl-0">
                <div className="w-full max-w-md aspect-square mx-auto relative">
                  {media.type === "video" ? (
                    <video
                      src={media.url}
                      className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={handleOpenFullscreen}
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={media.posterUrl}
                    />
                  ) : (
                    <CldImage
                      src={media.publicId}
                      priority={index === 0}
                      alt={media.alt ?? `${title} photo ${index + 1}`}
                      width={448}
                      height={448}
                      crop="fill"
                      sizes="100vw"
                      quality="auto"
                      loading={index === 0 ? "eager" : "lazy"}
                      className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={handleOpenFullscreen}
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {visualMedia.length > 1 && (
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
              {current + 1} / {visualMedia.length}
            </Chip>
          </div>
        )}
      </div>

      <FullScreenGallery
        photos={visualMedia}
        isOpen={isOpen}
        onClose={onClose}
        initialIndex={current}
        title={title}
        type={type}
        id={id}
        username={username}
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
  type,
  id,
  username,
}: {
  photos: (Media & { type: "image" | "video" })[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex: number;
  title: string;
  type: "project" | "program" | "event";
  id: string;
  username: string;
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
          posthog.capture("GalleryImageDwellTime", {
            mode: "fullscreen",
            image_index: oldIndex,
            duration_ms: dwellTime,
            total_items: photos.length,
            type,
            id,
            username,
            title,
          });
        }

        // Track swipe
        const direction = determineSwipeDirection(
          oldIndex,
          newIndex,
          photos.length,
        );
        posthog.capture("GallerySwipe", {
          mode: "fullscreen",
          direction,
          from_index: oldIndex,
          to_index: newIndex,
          total_items: photos.length,
          type,
          id,
          username,
          title,
        });

        // Reset timer for new image
        imageStartTimeRef.current = Date.now();
      }

      setCurrent(newIndex);
      previousIndexRef.current = newIndex;
    });
  }, [api, initialIndex, photos.length, type, id, username, title]);

  // Track final dwell time and close event when modal closes
  useEffect(() => {
    if (!isOpen && api) {
      const currentIndex = api.selectedScrollSnap();
      const currentPhoto = photos[currentIndex];

      // Track final dwell time
      const dwellTime = Date.now() - imageStartTimeRef.current;
      if (dwellTime > 0) {
        posthog.capture("GalleryImageDwellTime", {
          mode: "fullscreen",
          image_index: currentIndex,
          duration_ms: dwellTime,
          total_items: photos.length,
          type,
          id,
          username,
          title,
        });
      }

      // Track fullscreen close
      posthog.capture("GalleryCloseFullscreen", {
        index: currentIndex,
        url: currentPhoto?.publicId,
        media_type: currentPhoto?.type,
        total_items: photos.length,
        type,
        id,
        username,
        title,
      });
    }
  }, [isOpen, api, photos, type, id, username, title]);

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
              {photos.map((media, index) => (
                <CarouselItem key={index} className="basis-full pl-0 h-full">
                  <div className="w-full h-full relative flex items-center justify-center">
                    {media.type === "video" ? (
                      <video
                        src={media.url}
                        className="object-contain w-full h-full max-w-full max-h-full"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                        poster={media.posterUrl}
                      />
                    ) : (
                      <CldImage
                        src={media.publicId}
                        alt={media.alt ?? `${title} photo ${index + 1}`}
                        width={media.width}
                        height={media.height}
                        sizes="100vw"
                        className="object-contain"
                        priority
                      />
                    )}
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
