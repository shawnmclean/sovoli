"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@sovoli/ui/components/carousel";

import { MediaAssetViewer } from "~/modules/mediaAssets/components/MediaAssetViewer";
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
    <Carousel className="my-2 max-h-[540px] overflow-hidden rounded-lg">
      <CarouselContent>
        {coverAssets.map((image, i) => (
          <CarouselItem key={i} className="flex items-center justify-center">
            <figure className="relative aspect-[16/9] w-full">
              <div className="absolute inset-0 -z-10">
                <MediaAssetViewer
                  mediaAsset={image}
                  className="scale-110 object-cover blur-xl brightness-50"
                />
              </div>
              <MediaAssetViewer
                mediaAsset={image}
                className="relative z-10 object-contain"
              />
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
