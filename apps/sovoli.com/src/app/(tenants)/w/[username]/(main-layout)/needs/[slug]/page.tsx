import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Need } from "~/modules/needs/types";
import { getOrgInstanceByUsername } from "../../../lib/getOrgInstanceByUsername";
import { NeedDetails } from "./components/NeedDetails";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) {
    return notFound();
  }
  return result;
};

const selectNeed = (slug: string, needs: Need[]) =>
  needs.find((need) => need.slug === slug);

interface NeedPageProps {
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: NeedPageProps): Promise<Metadata> {
  const { username, slug } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  const needs = orgInstance.needsModule?.needs;
  if (!needs) {
    return notFound();
  }

  const need = selectNeed(slug, needs);
  if (!need) {
    return notFound();
  }

  const siteName = orgInstance.websiteModule.website.siteName;
  const title = need.title.trim().length > 0 ? need.title : "Organization Need";
  const hasDescription = (need.description?.trim().length ?? 0) > 0;
  const description = hasDescription
    ? need.description
    : `Details for ${title} at ${siteName}.`;

  return {
    title,
    description,
    keywords: [title, "need", siteName, slug],
  };
}

export default async function NeedDetailPage({ params }: NeedPageProps) {
  const { username, slug } = await params;
  const orgInstance = await retrieveOrgInstance(username);
  const needs = orgInstance.needsModule?.needs;

  if (!needs) {
    return notFound();
  }

  const need = selectNeed(slug, needs);
  if (!need) {
    return notFound();
  }

  return <NeedDetails need={need} />;
}
