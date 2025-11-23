import type { Metadata } from "next";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";

import { ProjectsDirectoryContent } from "./components/ProjectsDirectoryContent";
import { getAllProjectDirectoryEntries } from "./lib/projectsData";

export const metadata: Metadata = {
  title: "Active Projects Directory | Sovoli",
  description:
    "Browse urgent school recovery projects across the Sovoli network and discover where your support can make an immediate impact.",
  openGraph: {
    title: "Active Projects Directory | Sovoli",
    description:
      "Browse urgent school recovery projects across the Sovoli network and discover where your support can make an immediate impact.",
    images: [{ url: "/images/og.webp" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Active Projects Directory | Sovoli",
    description:
      "Browse urgent school recovery projects across the Sovoli network and discover where your support can make an immediate impact.",
    images: ["/images/og.webp"],
  },
};

interface ProjectsDirectoryPageProps {
  searchParams: Promise<{ view?: string }>;
}

export default async function ProjectsDirectoryPage({
  searchParams,
}: ProjectsDirectoryPageProps) {
  const viewParam = (await searchParams).view;
  const view: "list" | "map" = viewParam === "map" ? "map" : "list";

  const projects = getAllProjectDirectoryEntries();
  const totalProjects = projects.length;

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Support urgent school projects across Jamaica
              </h1>
              <p className="text-base text-white/80 sm:text-lg">
                The mission of this platform is to matchmake the needs for those
                who have the desire to help with those who need it.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button as={Link} href="/needs/new" color="secondary">
                Submit your project
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-8 pb-16 sm:-mt-10">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
          <ProjectsDirectoryContent
            projects={projects}
            totalProjects={totalProjects}
            view={view}
          />
        </div>
      </section>
    </>
  );
}
