import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";
import { ProjectsContent } from "./components/ProjectsContent";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ProjectsPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);
  const siteName = orgInstance.websiteModule.website.siteName;

  return {
    title: "Organization Projects",
    description: `Active projects underway at ${siteName}.`,
    keywords: ["projects", "organization projects", "initiatives", siteName],
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  if (!orgInstance.projectsModule) {
    return notFound();
  }

  return <ProjectsContent orgInstance={orgInstance} />;
}
