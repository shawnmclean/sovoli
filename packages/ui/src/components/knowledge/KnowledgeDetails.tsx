import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { MediaAssetHost } from "@sovoli/db/schema";
import { Gallery } from "@sovoli/ui/components/Gallery";

import { KnowledgeContent } from "../KnowledgeDetails/KnowledgeContent";
import { Button } from "../ui/button";
import { Link } from "../ui/link";
import { TimeAgo } from "../ui/time-ago";
import { User } from "../ui/user";

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
                  <Gallery images={images} />
                </div>
              )}
              <KnowledgeContent knowledge={knowledge} />
            </section>
          </div>

          {/* Right Column: User Information and Meta */}
          <div className="space-y-4">
            {/* User Information */}
            <section className="flex items-center space-x-4">
              <Link href={`/${knowledge.User?.username}`} color="foreground">
                <User
                  name={knowledge.User?.name}
                  avatarProps={{
                    radius: "sm",
                    size: "md",
                    src: "https://qxvzrmayigmtjhfucogx.supabase.co/storage/v1/object/public/media/profile/mix.webp?t=2024-10-26T02%3A43%3A35.093Z",
                  }}
                  description={<TimeAgo datetime={knowledge.createdAt} />}
                />
              </Link>
            </section>

            {/* Additional space for more information */}
            <div className="space-y-4 border-t border-divider pt-4">
              {/* Placeholder for future info */}
              <p className="text-gray-400">Type: {knowledge.type}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
