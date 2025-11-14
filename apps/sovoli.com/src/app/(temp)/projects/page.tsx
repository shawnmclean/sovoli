import type { Metadata } from "next";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";

import { pluralize } from "~/utils/pluralize";
import { ORGS } from "~/modules/data/organisations";
import type { OrgLocation } from "~/modules/organisations/types";
import type { Need } from "~/modules/needs/types";
import { DirectoryViewTabs } from "~/app/(directory)/d/components/DirectoryViewTabs";

import type { ProjectDirectoryEntry, ProjectNeedSummary } from "./types";
import { MapView } from "./components/MapView";
import { ListView } from "./components/ListView";

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

  const projects = buildProjectDirectoryEntries();
  const totalProjects = projects.length;

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Back urgent school recovery projects across Jamaica
              </h1>
              <p className="text-base text-white/80 sm:text-lg">
                Every listing includes scoped needs, timelines, and photos from
                school leaders on the ground. Switch views to find the
                workstream that aligns with your mission.
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
          <Card className="border border-blue-100 shadow-lg">
            <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
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

const TARGET_COUNTRY = "JM";

function buildProjectDirectoryEntries(): ProjectDirectoryEntry[] {
  const entries: ProjectDirectoryEntry[] = [];

  for (const orgInstance of ORGS) {
    const isInTargetCountry = orgInstance.org.locations.some((location) => {
      const countryCode = location.address.countryCode;
      return (
        countryCode &&
        countryCode.toLowerCase() === TARGET_COUNTRY.toLowerCase()
      );
    });
    if (!isInTargetCountry) continue;

    const projectModule = orgInstance.projectsModule;
    if (!projectModule || projectModule.projects.length === 0) continue;

    const fallbackPhotos = orgInstance.org.photos ?? [];

    for (const project of projectModule.projects) {
      const location = resolveProjectLocation(project.locationKey, orgInstance);
      const photos =
        project.photos && project.photos.length > 0
          ? project.photos
          : fallbackPhotos;

      entries.push({
        id: `${orgInstance.org.username}-${project.id}`,
        projectId: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        priority: project.priority,
        tags: project.tags ?? [],
        internal: project.internal ?? false,
        startDate: project.startDate,
        endDate: project.endDate,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        notes: project.notes,
        orgUsername: orgInstance.org.username,
        orgName: orgInstance.org.name,
        orgLogo: orgInstance.org.logo,
        orgCategories: orgInstance.org.categories,
        locationKey: project.locationKey ?? location?.key,
        locationLabel: location?.label ?? location?.address.line1,
        locationAddress: formatAddress(location),
        locationCity: location?.address.city,
        locationState: location?.address.state,
        locationCountryCode: location?.address.countryCode,
        coordinates: location?.coordinates,
        placeId: location?.placeId,
        photos,
        coverPhoto: photos[0] ?? null,
        needs: summarizeNeeds(project.needs ?? []),
      });
    }
  }

  return entries.sort((a, b) => {
    const left = a.updatedAt ?? a.startDate ?? "";
    const right = b.updatedAt ?? b.startDate ?? "";
    return right.localeCompare(left);
  });
}

function resolveProjectLocation(
  locationKey: string | undefined,
  orgInstance: (typeof ORGS)[number],
): OrgLocation | undefined {
  if (locationKey) {
    const match = orgInstance.org.locations.find(
      (location) => location.key === locationKey,
    );
    if (match) return match;
  }

  return (
    orgInstance.org.locations.find((location) => location.isPrimary) ??
    orgInstance.org.locations[0]
  );
}

function formatAddress(location: OrgLocation | undefined) {
  if (!location) return undefined;
  const parts = [
    location.address.line1,
    location.address.city,
    location.address.state,
    location.address.countryCode,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : undefined;
}

function summarizeNeeds(needs: Need[]): ProjectNeedSummary[] {
  return needs.map((need) => ({
    slug: need.slug,
    title: need.title,
    quantity: need.quantity,
    type: need.type,
    status: need.status,
    priority: need.priority,
  }));
}
