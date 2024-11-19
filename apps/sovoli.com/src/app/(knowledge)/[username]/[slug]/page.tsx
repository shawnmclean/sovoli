import type { Metadata } from "next";

import { env } from "~/env";
import { config } from "~/utils/config";
import { KnowledgeDetails } from "./components/KnowledgeDetails";
import { retreiveKnowledgeBySlug } from "./lib/getKnowledge";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { knowledge } = await retreiveKnowledgeBySlug({ params, searchParams });
  // Get the image path from the MediaAssets
  const image = knowledge.MediaAssets?.[0];

  // Construct the URL for the OpenGraph image using the Supabase public storage URL
  const imageUrl = image
    ? `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${image.bucket}/${image.path}`
    : undefined;
  return {
    title: `${knowledge.title} - ${knowledge.User?.name}`,
    openGraph: {
      title: `${knowledge.title} - ${knowledge.User?.name}`,
      url: config.url + "/" + params.username + "/" + knowledge.slug,
      siteName: config.siteName,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function KnowledgePage({ params, searchParams }: Props) {
  const { knowledge } = await retreiveKnowledgeBySlug({
    params,
    searchParams,
  });

  return <KnowledgeDetails knowledge={knowledge} />;
}
