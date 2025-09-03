import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrgInstanceByUsername } from "../../../lib/getOrgInstanceByUsername";
import { StudentSuppliesContent } from "./components/StudentSuppliesContent";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ProgramsPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProgramsPageProps): Promise<Metadata> {
  const { username } = await params;
  const {
    websiteModule: { website },
  } = await retrieveOrgInstance(username);

  return {
    title: "Student Supplies",
    description: `All student supplies and requirements for programs at ${website.siteName}.`,
    keywords: [
      "student supplies",
      "school requirements",
      "programs",
      website.siteName,
    ],
  };
}

export default async function ProgramsPage({ params }: ProgramsPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  return <StudentSuppliesContent orgInstance={orgInstance} />;
}
