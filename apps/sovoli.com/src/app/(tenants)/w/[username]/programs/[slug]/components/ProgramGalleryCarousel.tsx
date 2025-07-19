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
  ModalHeader,
} from "@sovoli/ui/components/dialog";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import { ChevronLeftIcon } from "lucide-react";

export interface ProgramGalleryCarouselProps {
  program: OrgProgram;
}

// Modal Component
function ProgramGalleryModal({
  photos,
  isOpen,
  onClose,
  initialIndex = 0,
}: {
  photos: { url: string }[];
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
                    <Image
                      src={photo.url}
                      alt={`Program photo ${index + 1}`}
                      fill
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
        <CarouselContent className="-ml-0">
          {photos.map((photo, index) => (
            <CarouselItem key={index} className="basis-full pl-0">
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
      <ProgramGalleryModal
        photos={photos}
        isOpen={isOpen}
        onClose={onClose}
        initialIndex={current}
      />
    </div>
  );
}
