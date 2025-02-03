import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { TimeAgo } from "@sovoli/ui/components/time-ago";

import { MediaAssetViewer } from "~/components/mediaAssets/MediaAssetViewer";
import { config } from "~/utils/config";
import { getLatestKnowledges } from "./lib/getLatestKnowledges";

export const dynamic = "force-dynamic";

const retrieveLatestKnowledges = cache(async () => {
  return await getLatestKnowledges();
});

export function generateMetadata(): Metadata {
  return {
    openGraph: {
      url: config.url,
      siteName: config.siteName,
    },
  };
}

export default async function DashboardPage() {
  const knowledges = await retrieveLatestKnowledges();

  return (
    <div className="min-h-screen dark:bg-black">
      <div className="mx-auto w-full max-w-5xl p-6">
        <header className="mb-10 text-center">
          <h1 className="mb-2 text-4xl font-bold">Writings on Sovoli</h1>
          <p className="text-lg text-gray-400">
            Insights, stories, and updates from our community.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {knowledges.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200 shadow-lg transition-shadow hover:shadow-xl"
            >
              <Link
                href={`/${item.User.username}/${item.slug ?? item.id}`}
                className="block"
              >
                <div className="relative h-48 bg-gray-100">
                  <KnowledgeImage knowledge={item} />
                </div>
                <div className="p-4">
                  <h2 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-200">
                    {item.title}
                  </h2>
                  <p className="mb-4 line-clamp-3 text-sm text-gray-400">
                    {item.description ?? "No description available."}
                  </p>
                  <div className="text-sm text-gray-500">
                    <TimeAgo datetime={item.createdAt} /> by{" "}
                    <Link
                      href={`/${item.User.username}`}
                      className="font-medium"
                    >
                      {item.User.name ?? "Anonymous"}
                    </Link>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KnowledgeImage({ knowledge }: { knowledge: SelectKnowledgeSchema }) {
  if (knowledge.KnowledgeMediaAssets?.[0]?.MediaAsset) {
    return (
      <MediaAssetViewer
        mediaAsset={knowledge.KnowledgeMediaAssets[0].MediaAsset}
        className="h-full w-full object-cover"
      />
    );
  }

  // Placeholder for posts without images
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
      No Image
    </div>
  );
}
