import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShelfScreen } from "@sovoli/ui/screens/mybooks/shelf";

import { getQueryClientRsc } from "~/api/query-client";
import { tsr } from "~/api/tsr";
import { config } from "~/utils/config";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined };
}

async function getShelfBooks({ params, searchParams }: Props) {
  const client = tsr.initQueryClient(getQueryClientRsc());
  try {
    return await client.getShelfBooks.fetchQuery({
      queryKey: ["username", "slug"],
      queryData: {
        params: {
          username: params.username,
          slug: params.slug,
        },
        query: {
          page: searchParams.page,
        },
      },
    });
  } catch (error) {
    // Type guard to check if error is an object with a 'status' property
    if (typeof error === "object" && error !== null && "status" in error) {
      const status = (error as { status?: number }).status; // Safe type assertion

      if (status === 404) return null;
    }
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const response = await getShelfBooks({ params, searchParams });

  if (!response) return notFound();

  const shelf = response.body.shelf;
  const coverImage = shelf.images?.[0];

  return {
    title: shelf.name,
    description: shelf.description,
    openGraph: {
      title: shelf.name,
      description: shelf.description ?? config.description,
      url: config.url + "/" + params.username + "/shelves/" + params.slug,
      siteName: config.siteName,
      images: coverImage && [
        {
          url: coverImage.url,
        },
      ],
    },
  };
}

export default async function ShelfPage({ params, searchParams }: Props) {
  const response = await getShelfBooks({ params, searchParams });

  if (!response) return notFound();

  return <ShelfScreen shelf={response.body} />;
}
