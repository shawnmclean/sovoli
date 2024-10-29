import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { MediaAssetHost } from "@sovoli/db/schema";
import { Gallery } from "@sovoli/ui/components/Gallery";

import { KnowledgeHeader } from "../knowledge/KnowledgeHeader";
import { Divider } from "../ui/divider";
import { TimeAgo } from "../ui/time-ago";
// import BookDetails from "./BookDetails";
import { CollectionDetails } from "./CollectionDetails";
import { KnowledgeContent } from "./KnowledgeContent";

// import NoteDetails from "./NoteDetails";=
interface Props {
  knowledge: SelectKnowledgeSchema;
}
export function KnowledgeDetails({ knowledge }: Props) {
  const images = knowledge.MediaAssets?.map((mediaAsset) => {
    if (mediaAsset.host === MediaAssetHost.Supabase && mediaAsset.path) {
      return {
        src: `${mediaAsset.bucket}/${mediaAsset.path}`,
        alt: mediaAsset.name ?? `${knowledge.title} image`,
      };
    }
    return null;
  }).filter((image) => image !== null);

  return (
    <>
      <KnowledgeHeader knowledge={knowledge} />
      <div className="my-2">{images && images.length > 0 && <Gallery />}</div>
      <div className="my-2">
        <p>{knowledge.description}</p>
      </div>
      <Divider />
      <div>
        <TimeAgo
          datetime={knowledge.createdAt}
          className="text-typography-500"
        />
      </div>
      <Divider />

      <div>
        <KnowledgeContent knowledge={knowledge} />
      </div>

      <KnowledgeComponentSwitcher knowledge={knowledge} />
    </>
  );
}

function KnowledgeComponentSwitcher({ knowledge }: Props) {
  // switch (knowledge.type) {
  //   case KnowledgeType.Book:
  //     return <BookDetails knowledge={knowledge} />;
  //   case KnowledgeType.Collection:
  return <CollectionDetails knowledge={knowledge} />;
  // case KnowledgeType.Note:
  //   return <NoteDetails knowledge={knowledge} />;
  // }
}
