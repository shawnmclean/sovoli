import type { Metadata } from "next";
import { cache } from "react";
import { getLatestKnowledges } from "@sovoli/api/services";
import { FeedScreen } from "@sovoli/ui/screens/feed";

import { config } from "~/utils/config";

export const dynamic = "force-dynamic";

const retrieveLatestKnowledges = cache(async () => {
  // try {
  return await getLatestKnowledges();
  // } catch {
  //   return notFound();
  // }
});

export function generateMetadata(): Metadata {
  return {
    title: `Feed`,
    openGraph: {
      title: `$Feed`,
      url: config.url + "/feed/",
      siteName: config.siteName,
    },
  };
}

export default async function FeedPage() {
  const knowledges = await retrieveLatestKnowledges();

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <FeedScreen knowledges={knowledges} />
    </div>
  );
}
