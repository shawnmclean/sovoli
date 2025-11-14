"use client";

import { useEffect, useState } from "react";
import { CldImage } from "next-cloudinary";
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
import { Button } from "@sovoli/ui/components/button";
import { ChevronLeftIcon } from "lucide-react";

import type { Photo } from "~/modules/core/photos/types";

interface ProjectGalleryCarouselProps {
  photos: Photo[];
  title: string;
}

export function ProjectGalleryCarousel({
  photos,
  title,
}: ProjectGalleryCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (photos.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center bg-slate-100 text-slate-500 md:h-[420px]">
        No photos available yet
      </div>
    );
  }

  return (
    <>
      <div className="relative h-[320px] w-full overflow-hidden bg-black md:h-[460px]">
        <Carousel
          className="h-full"
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="h-full">
            {photos.map((photo, index) => (
              <CarouselItem
                key={`${title}-${index}`}
                className="h-full basis-full"
              >
                <button
                  type="button"
                  onClick={onOpen}
                  className="relative h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <CldImage
                    src={photo.publicId}
                    alt={photo.alt ?? `${title} photo ${index + 1}`}
                    fill
                    sizes="100vw"
                    className="h-full w-full object-cover"
                    priority={index === 0}
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {photos.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            {current + 1} / {photos.length}
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

  useEffect(() => {
    if (!api) return;
    api.scrollTo(initialIndex);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, initialIndex]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="full" hideCloseButton>
      <ModalContent className="bg-black">
        <ModalHeader className="flex items-center justify-between text-white">
          <Button
            variant="light"
            isIconOnly
            radius="full"
            onPress={onClose}
            className="bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeftIcon />
          </Button>
          <span className="text-sm">
            {current + 1} / {photos.length}
          </span>
        </ModalHeader>
        <ModalBody className="flex-1 overflow-hidden p-0">
          <Carousel
            className="h-full"
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="h-full">
              {photos.map((photo, index) => (
                <CarouselItem
                  key={`${title}-modal-${index}`}
                  className="h-full basis-full"
                >
                  <div className="relative flex h-full w-full items-center justify-center bg-black">
                    <CldImage
                      src={photo.publicId}
                      alt={photo.alt ?? `${title} photo ${index + 1}`}
                      width={photo.width ?? 1600}
                      height={photo.height ?? 900}
                      sizes="100vw"
                      className="max-h-full w-auto object-contain"
                      priority={index === initialIndex}
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
