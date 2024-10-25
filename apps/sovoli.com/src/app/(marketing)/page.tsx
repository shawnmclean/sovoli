import type { Metadata } from "next";

import { config } from "~/utils/config";
import { Image } from "@sovoli/ui/components/ui/image";

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
      <Image src="https://images.isbndb.com/covers/49/68/9798686284968.jpg" alt="hi" width={100} height={100} />
      {/* <FeedScreen knowledges={knowledges} /> */}
    </div>
  );
}
