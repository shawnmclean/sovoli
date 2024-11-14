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
