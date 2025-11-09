import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";
import { NeedsContent } from "./components/NeedsContent";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ProcurementPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProcurementPageProps): Promise<Metadata> {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);
  const siteName = orgInstance.websiteModule.website.siteName;

  return {
    title: "Organization Needs",
    description: `Current needs requested by ${siteName}.`,
    keywords: ["needs", "organization needs", siteName],
  };
}

export default async function NeedsPage({ params }: ProcurementPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  if (!orgInstance.needsModule) {
    return notFound();
  }

  return <NeedsContent orgInstance={orgInstance} />;
}
