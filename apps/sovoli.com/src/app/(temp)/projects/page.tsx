import type { Metadata } from "next";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";

import { DirectoryViewTabs } from "~/app/(directory)/d/components/DirectoryViewTabs";

import { MapView } from "./components/MapView";
import { ListView } from "./components/ListView";
import { getAllProjectDirectoryEntries } from "./lib/projectsData";

export const metadata: Metadata = {
  title: "Active Projects Directory | Sovoli",
  description:
    "Browse urgent school recovery projects across the Sovoli network and discover where your support can make an immediate impact.",
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
                Support urgent school recovery projects across Jamaica
              </h1>
              <p className="text-base text-white/80 sm:text-lg">
                The mission of this platform is to matchmake the needs for those
                who have the desire to help with those who need it.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button as={Link} href="/needs/new" color="secondary">
                Submit a new project
              </Button>
              <Button
                as={Link}
                href="/d/public-school/jamaica"
                variant="light"
                className="bg-white/10 text-white hover:bg-white/20"
              >
                Browse schools
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-8 pb-16 sm:-mt-10">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
          <Card className="border border-divider shadow-lg">
            <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Filter and search here soon
                </p>
              </div>
              <DirectoryViewTabs defaultView={view} />
            </CardBody>
          </Card>

          {totalProjects === 0 ? (
            <Card>
              <CardBody className="text-center">
                <p className="text-lg font-semibold">No projects yet</p>
                <p className="mt-2 text-default-500">
                  We&apos;re coordinating new recovery initiatives. Check back
                  shortly or submit your school&apos;s needs.
                </p>
              </CardBody>
            </Card>
          ) : view === "map" ? (
            <MapView projects={projects} />
          ) : (
            <ListView projects={projects} />
          )}
        </div>
      </section>
    </>
  );
}
