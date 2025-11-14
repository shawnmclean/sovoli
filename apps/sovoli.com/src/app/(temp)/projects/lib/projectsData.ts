import { ORGS } from "~/modules/data/organisations";
import type { OrgLocation } from "~/modules/organisations/types";
import type { Need } from "~/modules/needs/types";

import type { ProjectDirectoryEntry, ProjectNeedSummary } from "../types";

const TARGET_COUNTRY = "JM";

export function getAllProjectDirectoryEntries(): ProjectDirectoryEntry[] {
  const entries = buildProjectDirectoryEntries();
  return entries.sort((a, b) => {
    const left = a.updatedAt ?? a.startDate ?? "";
    const right = b.updatedAt ?? b.startDate ?? "";
    return right.localeCompare(left);
  });
}

export function getProjectById(id: string): ProjectDirectoryEntry | undefined {
  return getAllProjectDirectoryEntries().find((project) => project.id === id);
}

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

  return entries;
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
