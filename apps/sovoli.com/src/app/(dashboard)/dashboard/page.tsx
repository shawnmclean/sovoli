import type { Metadata } from "next";
import { cache } from "react";
import { trace } from "@opentelemetry/api";
import { FeedScreen } from "@sovoli/ui/screens/feed";

import { config } from "~/utils/config";
import { getLatestKnowledges } from "./lib/getLatestKnowledges";

export const dynamic = "force-dynamic";

const retrieveLatestKnowledges = cache(async () => {
  return await trace
    .getTracer("nextjs-example")
    .startActiveSpan("retrieveLatestKnowledges1", async (span) => {
      try {
        return await getLatestKnowledges();
      } finally {
        span.end();
      }
    });
  // try {

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
