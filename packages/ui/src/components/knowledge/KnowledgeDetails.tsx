import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { MediaAssetHost } from "@sovoli/db/schema";
import { Gallery } from "@sovoli/ui/components/Gallery";

import { KnowledgeContent } from "../KnowledgeDetails/KnowledgeContent";
import { Button } from "../ui/button";
import { TimeAgo } from "../ui/time-ago";

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
    <div className="flex w-full flex-col">
      {/* Header Section */}
      <div className="flex justify-center border-b border-divider">
        <div className="flex w-full max-w-7xl items-center justify-between p-6">
          <h1 className="text-2xl font-bold">{knowledge.title}</h1>
          <div className="flex gap-4">
            <Button variant="bordered">Remix</Button>
            <Button variant="bordered">Star</Button>
          </div>
        </div>
      </div>

      {/* Main Content with 2-Column Layout */}
      <div className="flex justify-center">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          {/* Left Column: Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description Section */}
            <section className="w-full">
              <p className="text-gray-500">{knowledge.description}</p>
            </section>

            {/* Content Section */}
            <section className="w-full">
              {images && images.length > 0 && (
                <div className="my-4">
                  <Gallery />
                </div>
              )}
              <KnowledgeContent knowledge={knowledge} />
            </section>
          </div>

          {/* Right Column: User Information and Meta */}
          <div className="space-y-4">
            {/* User Information */}
            <section className="flex items-center space-x-4">
              <img alt="username avatar" className="h-12 w-12 rounded-full" />
              <div>
                <p className="font-medium">Username</p>
                <TimeAgo
                  datetime={knowledge.createdAt}
                  className="text-sm text-gray-500"
                />
              </div>
            </section>

            {/* Additional space for more information */}
            <div className="space-y-4 border-t border-divider pt-4">
              {/* Placeholder for future info */}
              <p className="text-gray-400">More details coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
