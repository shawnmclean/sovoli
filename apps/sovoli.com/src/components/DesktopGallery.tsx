"use client";

import { Button } from "@sovoli/ui/components/button";
import type { CarouselApi } from "@sovoli/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@sovoli/ui/components/dialog";
import { ChevronLeftIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";
import posthog from "posthog-js";
import { startTransition, useEffect, useRef, useState } from "react";

import type { Media } from "~/modules/core/media/types";
import { filterVisualMedia } from "~/modules/core/media/types";

export interface DesktopGalleryProps {
  media: Media[];
  title: string;
  emptyStateMessage?: string;
  className?: string;
  type: "project" | "program" | "event";
  id: string;
  username: string;
}

export function DesktopGallery({
  media: photos,
  title,
  emptyStateMessage = "No media available",
  className,
  type,
  id,
  username,
}: DesktopGalleryProps) {
  const visualMedia = filterVisualMedia(photos);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    const clickedMedia = visualMedia[index];
    if (clickedMedia) {
      posthog.capture("GalleryOpenFullscreen", {
        mode: "desktop",
        index,
        url: clickedMedia.publicId,
        media_type: clickedMedia.type,
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
      <div
        className={`w-full h-full bg-gray-100 flex items-center justify-center ${className ?? ""}`}
      >
        <p className="text-gray-500 text-sm">{emptyStateMessage}</p>
      </div>
    );
  }

  const mainPhoto = visualMedia[0];

  if (!mainPhoto) {
    return null;
  }

  const renderImage = (
    photo: Media & { type: "image" | "video" },
    index: number,
    className = "",
  ) => (
    <button
      key={index}
      type="button"
      className={`cursor-pointer hover:opacity-90 transition-opacity rounded-lg overflow-hidden p-0 border-0 bg-transparent ${className}`}
      onClick={() => handleImageClick(index)}
      aria-label={`View ${title} photo ${index + 1}`}
    >
      {photo.type === "video" ? (
        <video
          src={photo.url}
          className="object-cover w-full h-full aspect-[4/3]"
          autoPlay
          loop
          muted
          playsInline
          poster={photo.posterUrl}
        />
      ) : (
        <CldImage
          src={photo.publicId}
          alt={photo.alt ?? `${title} photo ${index + 1}`}
          width={index === 0 ? 800 : 300}
          height={index === 0 ? 600 : 225}
          crop="fill"
          aspectRatio="4:3"
          sizes={
            index === 0
              ? "(max-width: 768px) 100vw, 60vw"
              : "(max-width: 768px) 100vw, 20vw"
          }
          quality="auto"
          className="object-cover w-full h-full"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
        />
      )}
    </button>
  );

  return (
    <>
      <div className={`w-full ${className ?? ""}`}>
        {visualMedia.length === 1 ? (
          // 1 image: full width
          <div className="w-full aspect-[4/3]">
            {renderImage(mainPhoto, 0, "aspect-[4/3]")}
          </div>
        ) : visualMedia.length === 2 ? (
          // 2 images: equal size
          <div className="flex gap-2">
            {visualMedia.map((photo, index) => (
              <div key={index} className="flex-1 aspect-[4/3]">
                {renderImage(photo, index, "w-full h-full")}
              </div>
            ))}
          </div>
        ) : visualMedia.length === 3 ? (
          // 3 images: left larger, right split top/bottom
          <div className="flex gap-2 items-stretch">
            {visualMedia[0] && (
              <div className="flex-[2] aspect-[4/3]">
                {renderImage(visualMedia[0], 0, "w-full h-full")}
              </div>
            )}
            <div className="flex-1 flex flex-col gap-2 self-stretch">
              {visualMedia.slice(1, 3).map((photo, index) => {
                const photoIndex = index + 1;
                return (
                  <div key={photoIndex} className="flex-1 min-h-0">
                    {renderImage(photo, photoIndex, "w-full h-full")}
                  </div>
                );
              })}
            </div>
          </div>
        ) : visualMedia.length === 4 ? (
          // 4 images: left larger, right is 2x2 grid (top row has 2 images, bottom row has 1 full-width image)
          <div className="flex gap-2 items-stretch">
            {visualMedia[0] && (
              <div className="flex-[2] self-stretch">
                {renderImage(visualMedia[0], 0, "w-full h-full")}
              </div>
            )}
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 self-stretch overflow-hidden">
              {visualMedia[1] && (
                <div className="min-h-0 w-full h-full">
                  {renderImage(visualMedia[1], 1, "w-full h-full")}
                </div>
              )}
              {visualMedia[2] && (
                <div className="min-h-0 w-full h-full">
                  {renderImage(visualMedia[2], 2, "w-full h-full")}
                </div>
              )}
              {visualMedia[3] && (
                <div className="min-h-0 w-full h-full col-span-2">
                  {renderImage(visualMedia[3], 3, "w-full h-full")}
                </div>
              )}
            </div>
          </div>
        ) : (
          // 5+ images: left larger, right is 2x2 grid
          <div className="flex gap-2 items-stretch">
            {visualMedia[0] && (
              <div className="flex-[2] self-stretch">
                {renderImage(visualMedia[0], 0, "w-full h-full")}
              </div>
            )}
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 self-stretch overflow-hidden">
              {visualMedia.slice(1, 5).map((photo, index) => {
                const photoIndex = index + 1;
                return (
                  <div key={photoIndex} className="min-h-0 w-full h-full">
                    {renderImage(photo, photoIndex, "w-full h-full")}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <FullScreenGallery
        photos={visualMedia}
        isOpen={isOpen}
        onClose={onClose}
        initialIndex={selectedIndex}
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
  const imageStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    startTransition(() => {
      setCurrent(api.selectedScrollSnap());
    });
    previousIndexRef.current = initialIndex;
    imageStartTimeRef.current = Date.now();

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      const oldIndex = previousIndexRef.current;

      if (oldIndex !== newIndex) {
        const dwellTime = Date.now() - imageStartTimeRef.current;
        if (dwellTime > 0) {
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

        imageStartTimeRef.current = Date.now();
      }

      setCurrent(newIndex);
      previousIndexRef.current = newIndex;
    });
  }, [api, initialIndex, photos.length, type, id, username, title]);

  useEffect(() => {
    if (!isOpen && api) {
      const currentIndex = api.selectedScrollSnap();
      const currentPhoto = photos[currentIndex];

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
  if (fromIndex === totalItems - 1 && toIndex === 0) {
    return "right";
  }
  if (fromIndex === 0 && toIndex === totalItems - 1) {
    return "left";
  }
  return toIndex > fromIndex ? "right" : "left";
}
