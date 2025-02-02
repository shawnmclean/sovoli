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
import { CldImage } from "next-cloudinary";

import { MediaAssetViewer } from "~/components/mediaAssets/MediaAssetViewer";
import supabaseLoader from "~/loaders/supabaseImageLoader";
import { useKnowledge } from "../context/KnowledgeContext";

export function KnowledgeGallery() {
  const knowledge = useKnowledge();

  const coverAssets = knowledge.KnowledgeMediaAssets?.map(
    (knowledgeMediaAsset) => {
      if (knowledgeMediaAsset.placement === "cover") {
        return knowledgeMediaAsset.MediaAsset;
      }

      return null;
    },
  ).filter((image) => image !== null);

  if (!coverAssets || coverAssets.length < 1) return;

  return (
    <Carousel className="overflow-hidden rounded-lg">
      <CarouselContent>
        {coverAssets.map((image, i) => (
          <CarouselItem key={i} className="flex items-center justify-center">
            <div className="relative h-[500px] w-[100%]">
              <MediaAssetViewer mediaAsset={image} className="object-contain" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
