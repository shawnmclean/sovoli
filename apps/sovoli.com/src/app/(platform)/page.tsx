import type { Metadata } from "next";

import { config } from "~/utils/config";
// import { Image } from "@sovoli/ui/components/ui/image";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return {
    openGraph: {
      url: config.url + "/feed/",
      siteName: config.siteName,
    },
  };
}

export default function FeedPage() {

  return (
    <div className="min-h-screen sm:pl-60 dark:bg-black">
      {/* <Image fill src="media/71f089d5-7094-4e37-8dc4-6a5929a9ec41.webp" alt="hi" /> */}
      {/* <FeedScreen knowledges={knowledges} /> */}
    </div>
  );
}
