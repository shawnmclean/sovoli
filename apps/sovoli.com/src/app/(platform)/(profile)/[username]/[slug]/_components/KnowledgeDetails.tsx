import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import Image from "next/image";
import { KnowledgeType, MediaAssetHost } from "@sovoli/db/schema";

import BookDetails from "./BookDetails";
import CollectionDetails from "./CollectionDetails";
import NoteDetails from "./NoteDetails";

interface Props {
  knowledge: SelectKnowledgeSchema;
}
export default function KnowledgeDetails({ knowledge }: Props) {
  const images = knowledge.MediaAssets.map((mediaAsset) => {
    if (mediaAsset.host === MediaAssetHost.Supabase && mediaAsset.path) {
      return {
        src: `${mediaAsset.bucket}/${mediaAsset.path}`,
        alt: mediaAsset.name ?? `${knowledge.title} image`,
      };
    }
    return null;
  }).filter((image) => image !== null);

  return (
    <div>
      <ImageCarousel images={images} />
      <h1>{knowledge.title}</h1>
      <p>{knowledge.description}</p>
      <KnowledgeComponentSwitcher knowledge={knowledge} />
    </div>
  );
}

function KnowledgeComponentSwitcher({ knowledge }: Props) {
  switch (knowledge.type) {
    case KnowledgeType.Book:
      return <BookDetails knowledge={knowledge} />;
    case KnowledgeType.Collection:
      return <CollectionDetails knowledge={knowledge} />;
    case KnowledgeType.Note:
      return <NoteDetails knowledge={knowledge} />;
  }
}

interface ImageCarouselProps {
  images: { src: string; alt: string }[];
}
function ImageCarousel({ images }: ImageCarouselProps) {
  return (
    <div className="flex flex-row gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative h-72 max-h-72 w-full">
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            layout="fill"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
