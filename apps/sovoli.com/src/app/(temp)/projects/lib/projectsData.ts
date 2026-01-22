import { ORGS } from "~/modules/data/organisations";
import type { Need } from "~/modules/needs/types";
import type { OrgLocation } from "~/modules/organisations/types";

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
  const processedGroups = new Set<string>(); // Track processed groups by org+groupId

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

    const fallbackMedia = orgInstance.org.media ?? [];

    // Group projects by their group ID
    const projectsByGroup = new Map<
      string,
      {
        project: (typeof projectModule.projects)[number];
        location: OrgLocation | undefined;
      }[]
    >();
    const ungroupedProjects: {
      project: (typeof projectModule.projects)[number];
      location: OrgLocation | undefined;
    }[] = [];

    for (const project of projectModule.projects) {
      const location = resolveProjectLocation(project.locationKey, orgInstance);
      if (project.group) {
        const groupKey = `${orgInstance.org.username}-${project.group.id}`;
        if (!projectsByGroup.has(groupKey)) {
          projectsByGroup.set(groupKey, []);
        }
        projectsByGroup.get(groupKey)?.push({ project, location });
      } else {
        ungroupedProjects.push({ project, location });
      }
    }

    // Create entries for groups
    for (const [groupKey, groupProjects] of projectsByGroup) {
      if (processedGroups.has(groupKey)) continue;
      processedGroups.add(groupKey);

      // Sort group projects by their order (if available) to ensure consistent first project
      const sortedGroupProjects = [...groupProjects].sort((a, b) => {
        const aOrder = a.project.group?.order ?? 999;
        const bOrder = b.project.group?.order ?? 999;
        return aOrder - bOrder;
      });

      const firstProjectData = sortedGroupProjects[0];
      if (!firstProjectData) continue;

      const { project: firstProject, location: firstLocation } =
        firstProjectData;
      const group = firstProject.group;
      if (!group) continue;

      // Aggregate data from all projects in the group
      const allNeeds: Need[] = [];
      const allTags = new Set<string>();
      let highestPriority: ProjectDirectoryEntry["priority"] =
        firstProject.priority;
      let mostActiveStatus: ProjectDirectoryEntry["status"] =
        firstProject.status;
      let earliestStartDate = firstProject.startDate;
      let latestEndDate = firstProject.endDate;
      let latestUpdatedAt = firstProject.updatedAt;
      let earliestCreatedAt = firstProject.createdAt;

      for (const { project } of sortedGroupProjects) {
        // Aggregate needs
        if (project.needs) {
          allNeeds.push(...project.needs);
        }

        // Aggregate tags
        if (project.tags) {
          project.tags.forEach((tag) => {
            allTags.add(tag);
          });
        }

        // Determine highest priority (critical > high > medium > low)
        if (project.priority) {
          const priorityOrder: ProjectDirectoryEntry["priority"][] = [
            "critical",
            "high",
            "medium",
            "low",
          ];
          const currentIndex = priorityOrder.indexOf(project.priority);
          const highestIndex = highestPriority
            ? priorityOrder.indexOf(highestPriority)
            : -1;
          if (
            currentIndex >= 0 &&
            (highestIndex < 0 || currentIndex < highestIndex)
          ) {
            highestPriority = project.priority;
          }
        }

        // Determine most active status (active > planned > completed > cancelled)
        if (project.status) {
          const statusOrder: ProjectDirectoryEntry["status"][] = [
            "active",
            "planned",
            "completed",
            "cancelled",
          ];
          const currentIndex = statusOrder.indexOf(project.status);
          const mostActiveIndex = mostActiveStatus
            ? statusOrder.indexOf(mostActiveStatus)
            : -1;
          if (
            currentIndex >= 0 &&
            (mostActiveIndex < 0 || currentIndex < mostActiveIndex)
          ) {
            mostActiveStatus = project.status;
          }
        }

        // Track earliest start date
        if (project.startDate) {
          if (!earliestStartDate || project.startDate < earliestStartDate) {
            earliestStartDate = project.startDate;
          }
        }

        // Track latest end date
        if (project.endDate) {
          if (!latestEndDate || project.endDate > latestEndDate) {
            latestEndDate = project.endDate;
          }
        }

        // Track latest updated date
        if (project.updatedAt) {
          if (!latestUpdatedAt || project.updatedAt > latestUpdatedAt) {
            latestUpdatedAt = project.updatedAt;
          }
        }

        // Track earliest created date
        if (project.createdAt) {
          if (!earliestCreatedAt || project.createdAt < earliestCreatedAt) {
            earliestCreatedAt = project.createdAt;
          }
        }
      }

      // Use first project's media, or fallback
      const media =
        firstProject.media && firstProject.media.length > 0
          ? firstProject.media
          : fallbackMedia;

      entries.push({
        id: groupKey,
        projectId: firstProject.id, // Use first project's ID for reference
        title: group.name,
        description: group.description ?? firstProject.description,
        category: firstProject.category, // Use first project's category
        status: mostActiveStatus,
        priority: highestPriority,
        tags: Array.from(allTags),
        internal: firstProject.internal ?? false,
        startDate: earliestStartDate,
        endDate: latestEndDate,
        createdAt: earliestCreatedAt,
        updatedAt: latestUpdatedAt,
        notes: firstProject.notes, // Use first project's notes
        groupId: group.id,
        groupSlug: group.slug,
        orgUsername: orgInstance.org.username,
        orgName: orgInstance.org.name,
        orgLogo: orgInstance.org.logoPhoto?.url,
        orgCategories: orgInstance.org.categories,
        locationKey: firstProject.locationKey ?? firstLocation?.key,
        locationLabel: firstLocation?.label ?? firstLocation?.address.line1,
        locationAddress: formatAddress(firstLocation),
        locationAddressLine1: firstLocation?.address.line1,
        locationCity: firstLocation?.address.city,
        locationState: firstLocation?.address.state,
        locationCountryCode: firstLocation?.address.countryCode,
        coordinates: firstLocation?.coordinates,
        placeId: firstLocation?.placeId,
        media,
        coverMedia: media[0] ?? null,
        needs: summarizeNeeds(allNeeds),
      });
    }

    // Create entries for ungrouped projects
    for (const { project, location } of ungroupedProjects) {
      const media =
        project.media && project.media.length > 0
          ? project.media
          : fallbackMedia;

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
        orgLogo: orgInstance.org.logoPhoto?.url,
        orgCategories: orgInstance.org.categories,
        locationKey: project.locationKey ?? location?.key,
        locationLabel: location?.label ?? location?.address.line1,
        locationAddress: formatAddress(location),
        locationAddressLine1: location?.address.line1,
        locationCity: location?.address.city,
        locationState: location?.address.state,
        locationCountryCode: location?.address.countryCode,
        coordinates: location?.coordinates,
        placeId: location?.placeId,
        media,
        coverMedia: media[0] ?? null,
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
  return needs.map((need) => {
    const baseSummary: ProjectNeedSummary = {
      slug: need.slug,
      title: need.title,
      quantity: need.quantity,
      type: need.type,
      status: need.status,
      priority: need.priority,
    };

    // Only material needs have an item
    if (need.type === "material") {
      return {
        ...baseSummary,
        item: need.item,
      };
    }

    // Non-material needs (human, service, financial, job) don't have items
    return baseSummary;
  });
}
