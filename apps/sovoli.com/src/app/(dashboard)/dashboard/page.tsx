import type { Metadata } from "next";
import { cache } from "react";
import { FeedScreen } from "@sovoli/ui/screens/feed";

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
      <FeedScreen knowledges={knowledges} />
    </div>
  );
}
