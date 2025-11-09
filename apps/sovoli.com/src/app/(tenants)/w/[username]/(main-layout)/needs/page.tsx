import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";
import { ProcurementContent } from "./components/ProcurementContent";

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
    title: "Procurement Needs",
    description: `Current procurement items requested by ${siteName}.`,
    keywords: [
      "procurement",
      "school procurement",
      "facility upgrades",
      "suppliers",
      siteName,
    ],
  };
}

export default async function ProcurementPage({
  params,
}: ProcurementPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  if (!orgInstance.procurementModule) {
    return notFound();
  }

  return <ProcurementContent orgInstance={orgInstance} />;
}
