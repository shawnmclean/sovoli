"use client";

import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { MediaAssetHost } from "@sovoli/db/schema";
import { Image } from "@sovoli/ui/components/ui/image";
import { Link } from "@sovoli/ui/components/ui/link";
import { TimeAgo } from "@sovoli/ui/components/ui/time-ago";

export interface FeedScreenProps {
  knowledges: SelectKnowledgeSchema[];
}

export function FeedScreen({ knowledges }: FeedScreenProps) {
  return (
    <div
      className="mb-20 h-full w-full max-w-[1500px] self-center p-4 pb-0 md:mb-2 md:px-10 md:pb-0 md:pt-6"
    >
      <h1 className="font-roboto">
        What's new?
      </h1>

      <div className="h-full w-full flex-1">

            {knowledges.map((item, index) => {
              return (
                <Link
                color="foreground"
                  key={index}
                  href={`${item.User?.username}/${item.slug ?? item.id}`}
                >
                  <div className="border-border-300 rounded-xl border p-5">
                    <div className="h-64 w-full rounded">
                      <KnowledgeImage knowledge={item} />
                    </div>
                    <div className="mt-4" >
                      <p className="text-sm">
                        <TimeAgo
                          datetime={item.createdAt}
                          className="text-typography-500"
                        />
                      </p>
                      <h3 >{item.title}</h3>
                      <p className="line-clamp-2">{item.description}</p>
                      <p className="text-sm">
                        {item.type} created by{" "}
                        <Link href={`/${item.User?.username}`}>
                          {item.User?.name}
                        </Link>
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
}

function KnowledgeImage({ knowledge }: { knowledge: SelectKnowledgeSchema }) {
  const images = knowledge.MediaAssets?.map((mediaAsset) => {
    if (mediaAsset.host === MediaAssetHost.Supabase && mediaAsset.path) {
      return {
        src: `${mediaAsset.bucket}/${mediaAsset.path}`,
        alt: mediaAsset.name ?? `${knowledge.title} image`,
      };
    }
    return null;
  }).filter((image) => image !== null);

  if (images?.[0]) {
    return <Image src={images[0].src} alt={images[0].alt} fill />;
  }
}
