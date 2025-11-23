"use client";

import { useState, useMemo, useEffect } from "react";
import posthog from "posthog-js";
import { OrganizationAutocomplete } from "~/components/OrganizationAutocomplete";
import type { ProjectDirectoryEntry } from "../types";

interface ProjectsSearchProps {
  projects: ProjectDirectoryEntry[];
  onFilteredProjectsChange: (filtered: ProjectDirectoryEntry[]) => void;
}

export function ProjectsSearch({
  projects,
  onFilteredProjectsChange,
}: ProjectsSearchProps) {
  const [selectedOrgKey, setSelectedOrgKey] = useState<string | null>(null);

  // Filter projects based on selected organization
  const filteredProjects = useMemo(() => {
    if (!selectedOrgKey) {
      return projects;
    }
    return projects.filter((project) => project.orgUsername === selectedOrgKey);
  }, [projects, selectedOrgKey]);

  // Notify parent when filtered projects change
  useEffect(() => {
    onFilteredProjectsChange(filteredProjects);
  }, [filteredProjects, onFilteredProjectsChange]);

  const handleSelectionChange = (key: string | null) => {
    setSelectedOrgKey(key);

    // Track search event
    if (key) {
      const selectedProject = projects.find(
        (project) => project.orgUsername === key,
      );
      const resultsCount = projects.filter(
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
  };

  const handleClear = () => {
    setSelectedOrgKey(null);
    // Track clear filter event
    posthog.capture("ProjectsSearchCleared", {
      content_type: "projects_directory",
      content_category: "search",
    });
  };

  return (
    <div className="space-y-2">
      <OrganizationAutocomplete
        label="Find schools"
        selectedKey={selectedOrgKey}
        onSelectionChange={handleSelectionChange}
        placeholder="Search for a school..."
        categoryGroup="school"
        countryCode="JM"
        className="w-full"
      />
      {selectedOrgKey && (
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
