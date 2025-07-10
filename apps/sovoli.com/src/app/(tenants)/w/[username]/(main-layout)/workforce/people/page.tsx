import { notFound } from "next/navigation";

import { TeamDirectory } from "./components/TeamDirectory";
import type { Metadata } from "next";
import { getOrgInstanceByUsername } from "../../../lib/getOrgInstanceByUsername";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface TeamPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { username } = await params;
  const {
    websiteModule: { website },
  } = await retrieveOrgInstance(username);

  return {
    title: "Team Directory",
    description: `Browse our team directory to meet the talented professionals behind ${website.siteName}. Find contact information, roles, and expertise of our team members.`,
    keywords: [
      "team directory",
      "staff directory",
      "company personnel",
      "team members",
      "employee directory",
      "organization structure",
      website.siteName,
    ],
    openGraph: {
      title: `Team Directory | ${website.siteName}`,
      description: `Browse our team directory to meet the talented professionals behind ${website.siteName}. Find contact information, roles, and expertise of our team members.`,
      type: "website",
    },
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  return <TeamDirectory orgInstance={orgInstance} />;
}
