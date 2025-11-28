"use client";

import type { OrgInstance } from "~/modules/organisations/types";
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
import { useState, useEffect, useTransition } from "react";
import { Button } from "@sovoli/ui/components/button";
import { ChevronLeftIcon } from "lucide-react";
import type { Media } from "~/modules/core/media/types";
import { filterVisualMedia } from "~/modules/core/media/types";

export interface OrgGalleryCarouselProps {
  orgInstance: OrgInstance;
}

// Modal Component
function OrgGalleryModal({
  photos,
  isOpen,
  onClose,
  initialIndex = 0,
}: {
  photos: (Media & { type: "image" | "video" })[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(initialIndex);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!api) {
      return;
    }

    startTransition(() => {
      setCurrent(api.selectedScrollSnap());
    });

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
                        alt={`Organization photo ${index + 1}`}
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

export function OrgGalleryCarousel({ orgInstance }: OrgGalleryCarouselProps) {
  const allMedia = orgInstance.org.media ?? [];
  // Filter to only show visual media (images and videos) - exclude PDFs and other documents
  const photos = filterVisualMedia(allMedia);

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!api) {
      return;
    }

    startTransition(() => {
      setCurrent(api.selectedScrollSnap());
    });

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
    <div className="w-full max-w-full md:max-w-2xl mx-auto relative aspect-[16/9]">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0">
          {photos.map((media, index) => (
            <CarouselItem key={index} className="basis-full pl-0">
              <div className="w-full max-w-2xl aspect-[16/9] mx-auto relative">
                {media.type === "video" ? (
                  <video
                    src={media.url}
                    className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={onOpen}
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
                    alt={`Organization photo ${index + 1}`}
                    width={800}
                    height={450}
                    crop="fill"
                    sizes="100vw"
                    quality="auto"
                    loading={index === 0 ? "eager" : "lazy"}
                    className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={onOpen}
                  />
                )}
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
              base: "bg-black/50 text-white",
            }}
          >
            {current + 1} / {photos.length}
          </Chip>
        </div>
      )}

      {/* Full Screen Modal */}
      <OrgGalleryModal
        photos={photos}
        isOpen={isOpen}
        onClose={onClose}
        initialIndex={current}
      />
    </div>
  );
}
