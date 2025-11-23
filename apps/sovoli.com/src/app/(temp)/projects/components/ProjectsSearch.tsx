"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import posthog from "posthog-js";
import { OrganizationAutocomplete } from "~/components/OrganizationAutocomplete";
import { getAllProjectDirectoryEntries } from "../lib/projectsData";

interface ProjectsSearchProps {
  selectedOrg?: string;
}

export function ProjectsSearch({ selectedOrg }: ProjectsSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelectionChange = (key: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (key) {
      params.set("org", key);
      // Reset to page 1 when filtering
      params.set("page", "1");
    } else {
      params.delete("org");
      params.delete("page");
    }

    const query = params.toString();

    // Track search event
    if (key) {
      const allProjects = getAllProjectDirectoryEntries();
      const selectedProject = allProjects.find(
        (project) => project.orgUsername === key,
      );
      const resultsCount = allProjects.filter(
        (project) => project.orgUsername === key,
      ).length;
      posthog.capture("ProjectsSearch", {
        content_type: "projects_directory",
        content_category: "search",
        org_username: key,
        org_name: selectedProject?.orgName,
        results_count: resultsCount,
      });
    } else {
      // Track clear filter event
      posthog.capture("ProjectsSearchCleared", {
        content_type: "projects_directory",
        content_category: "search",
      });
    }

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("org");
    params.delete("page");

    const query = params.toString();

    // Track clear filter event
    posthog.capture("ProjectsSearchCleared", {
      content_type: "projects_directory",
      content_category: "search",
    });

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className="space-y-2">
      <OrganizationAutocomplete
        label="Find schools"
        selectedKey={selectedOrg ?? null}
        onSelectionChange={handleSelectionChange}
        placeholder="Search for a school..."
        categoryGroup="school"
        countryCode="JM"
        className="w-full"
      />
      {selectedOrg && (
        <button
          onClick={handleClear}
          className="text-sm text-primary hover:underline"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}
