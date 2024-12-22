import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { config } from "~/utils/config";

// import { Image } from "@sovoli/ui/components/image";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return {
    openGraph: {
      url: config.url,
      siteName: config.siteName,
    },
  };
}

export default function FeedPage() {
  return redirect("/dashboard");
  return <div className="min-h-screen dark:bg-black"></div>;
}
