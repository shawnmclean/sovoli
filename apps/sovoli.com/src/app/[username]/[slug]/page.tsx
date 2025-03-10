import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { Navbar } from "~/components/navbar/Navbar";
import { env } from "~/env";
import { config } from "~/utils/config";
import { KnowledgeDetails } from "./components/KnowledgeDetails";
import { KnowledgeNavbarAppLinks } from "./components/KnowledgeNavbarAppLinks";
// import { KnowledgeSubmenu } from "./components/KnowledgeSubmenu";
import { KnowledgeProvider } from "./context/KnowledgeContext";
import { getKnowledgeBySlugOrId, preload } from "./lib/getKnowledgeBySlugOrId";

export const revalidate = 3600;

const retreiveKnowledgeBySlug = async (username: string, slugOrId: string) => {
  const response = await getKnowledgeBySlugOrId(username, slugOrId);
  if (!response?.knowledge) return notFound();

  if (response.knowledge.id === slugOrId && response.knowledge.slug) {
    return permanentRedirect(`/${username}/${response.knowledge.slug}`);
  }
  return response.knowledge;
};

export async function generateMetadata({
  params,
}: KnowledgePageProps): Promise<Metadata> {
  const { username, slug } = await params;
  const knowledge = await retreiveKnowledgeBySlug(username, slug);
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
      url: config.url + "/" + username + "/" + knowledge.slug,
      siteName: config.siteName,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

interface KnowledgePageProps {
  params: Promise<{ username: string; slug: string }>;
}

export default async function KnowledgePage({ params }: KnowledgePageProps) {
  const { username, slug } = await params;

  preload(username, slug);

  const knowledge = await retreiveKnowledgeBySlug(username, slug);
  return (
    <KnowledgeProvider knowledge={knowledge}>
      <Navbar AppLinks={<KnowledgeNavbarAppLinks knowledge={knowledge} />} />

      <main>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row">
          <KnowledgeDetails />
        </div>
      </main>
    </KnowledgeProvider>
  );
}
