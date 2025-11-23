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
  searchParams: Promise<{
    view?: string;
    page?: string;
    pageSize?: string;
    org?: string;
  }>;
}

export default async function ProjectsDirectoryPage({
  searchParams,
}: ProjectsDirectoryPageProps) {
  const params = await searchParams;
  const viewParam = params.view;
  const view: "list" | "map" = viewParam === "map" ? "map" : "list";
  const page = parseInt(params.page ?? "1");
  const pageSize = parseInt(params.pageSize ?? "10");
  const orgParam = params.org;

  // Get all projects
  let projects = getAllProjectDirectoryEntries();

  // Filter by organization if org param exists
  if (orgParam) {
    projects = projects.filter((project) => project.orgUsername === orgParam);
  }

  const totalProjects = projects.length;

  // For map view, show all projects (no pagination)
  // For list view, paginate
  let paginatedProjects = projects;
  if (view === "list") {
    // List view paginates
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    paginatedProjects = projects.slice(startIndex, endIndex);
  }
  // Map view already has all projects, no need to slice

  const totalPages = Math.ceil(totalProjects / pageSize);

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
            projects={paginatedProjects}
            totalProjects={totalProjects}
            view={view}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            selectedOrg={orgParam}
          />
        </div>
      </section>
    </>
  );
}
