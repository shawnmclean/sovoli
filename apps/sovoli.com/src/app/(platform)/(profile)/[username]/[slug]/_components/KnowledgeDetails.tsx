import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { KnowledgeType, MediaAssetHost } from "@sovoli/db/schema";
import { Gallery } from "@sovoli/ui/components/Gallery";

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
      {images.length > 0 && <Gallery images={images} />}
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
