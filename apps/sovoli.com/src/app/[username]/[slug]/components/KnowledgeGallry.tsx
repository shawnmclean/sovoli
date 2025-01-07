"use client";

import Image from "next/image";
import { MediaAssetHost } from "@sovoli/db/schema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@sovoli/ui/components/carousel";

import supabaseLoader from "~/loaders/supabaseImageLoader";
import { useKnowledge } from "../context/KnowledgeContext";

export function KnowledgeGallery() {
  const knowledge = useKnowledge();

  const images = knowledge.MediaAssets?.map((mediaAsset) => {
    if (mediaAsset.host === MediaAssetHost.Supabase && mediaAsset.path) {
      return {
        src: `${mediaAsset.bucket}/${mediaAsset.path}`,
        alt: mediaAsset.name ?? `${knowledge.title} image`,
      };
    }
    return null;
  }).filter((image) => image !== null);

  if (!images || images.length < 1) return;

  return (
    <Carousel className="overflow-hidden rounded-lg">
      <CarouselContent>
        {images.map((image, i) => (
          <CarouselItem key={i} className="flex items-center justify-center">
            <div className="relative h-[500px] w-[100%]">
              <Image
                src={image.src}
                alt={image.alt || "Image"}
                className="object-contain"
                fill
                loader={supabaseLoader}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
