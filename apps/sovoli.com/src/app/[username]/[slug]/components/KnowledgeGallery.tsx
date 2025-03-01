"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@sovoli/ui/components/carousel";
import { CldImage } from "next-cloudinary";

import { useKnowledge } from "../context/KnowledgeContext";

export function KnowledgeGallery() {
  const knowledge = useKnowledge();

  const coverAssets = knowledge.KnowledgeMediaAssets?.map(
    (knowledgeMediaAsset) =>
      knowledgeMediaAsset.placement === "cover"
        ? knowledgeMediaAsset.MediaAsset
        : null,
  ).filter((image) => image !== null);

  if (!coverAssets || coverAssets.length < 1) return null; // Prevent errors

  return (
    <Carousel className="flex items-center justify-center overflow-hidden rounded-lg border border-default-200">
      <CarouselContent className="flex h-full">
        {coverAssets.map((image, i) => {
          const width = 4032;
          const height = 3024;

          return (
            <CarouselItem
              key={i}
              className="flex w-full items-center justify-center"
            >
              <figure className="relative flex w-full items-center justify-center overflow-hidden">
                {/* Background Blur Layer (Ensures It Never Exceeds `figure`) */}
                <CldImage
                  src={`${image.bucket}/${image.id}`}
                  alt="Blurred Background"
                  width={width}
                  height={height}
                  priority
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  className="absolute inset-0 w-full scale-[1.4] object-cover opacity-30 blur-xl brightness-50"
                />

                {/* Foreground Image - Now Fully Contained */}
                <CldImage
                  src={`${image.bucket}/${image.id}`}
                  alt={image.name ?? "Media Asset"}
                  width={width}
                  height={height}
                  priority
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  className="relative h-auto max-h-[60vh] max-w-full object-contain"
                />
              </figure>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
