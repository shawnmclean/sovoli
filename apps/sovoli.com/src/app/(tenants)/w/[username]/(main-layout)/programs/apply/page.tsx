import { notFound } from "next/navigation";

import { ApplyCard } from "./components/ApplyCard";
import { getOrgInstanceByUsername } from "../../../lib/getOrgInstanceByUsername";
import type { Metadata } from "next";
import { Alert } from "@sovoli/ui/components/alert";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ProgramsApplyPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProgramsApplyPageProps): Promise<Metadata> {
  const { username } = await params;
  const {
    websiteModule: { website },
  } = await retrieveOrgInstance(username);

  return {
    title: `Apply to Programs | ${website.siteName}`,
    description: `Apply to our academic programs at ${website.siteName}. View program requirements and start your application process today.`,
    keywords: [
      "apply",
      "application",
      "program requirements",
      "academic programs",
      "education",
      website.siteName,
    ],
    openGraph: {
      title: `Apply to Programs | ${website.siteName}`,
      description: `Apply to our academic programs at ${website.siteName}. View program requirements and start your application process today.`,
      type: "website",
      url: `${website.url}/programs`,
      siteName: website.siteName,
      images: website.images,
    },
    twitter: {
      card: "summary_large_image",
      title: `Apply to Programs | ${website.siteName}`,
      description: `Apply to our academic programs at ${website.siteName}. View program requirements and start your application process today.`,
      images: website.images.map((img) => img.url),
    },
  };
}

export default async function ProgramsApplyPage({
  params,
}: ProgramsApplyPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  return (
    <div className="container mx-auto max-w-6xl px-6 py-4">
      <Alert color="warning">Work in Progress</Alert>

      <ApplyCard orgInstance={orgInstance} />
    </div>
  );
}
