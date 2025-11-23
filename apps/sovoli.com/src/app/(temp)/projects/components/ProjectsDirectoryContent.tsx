"use client";

import { useState } from "react";
import { Card, CardBody } from "@sovoli/ui/components/card";

import { MapView } from "./MapView";
import { ListView } from "./ListView";
import { ProjectsSearch } from "./ProjectsSearch";
import { ProjectsViewTabs } from "./ProjectsViewTabs";
import type { ProjectDirectoryEntry } from "../types";

interface ProjectsDirectoryContentProps {
  projects: ProjectDirectoryEntry[];
  totalProjects: number;
  view: "list" | "map";
}

export function ProjectsDirectoryContent({
  projects,
  totalProjects,
  view,
}: ProjectsDirectoryContentProps) {
  const [filteredProjects, setFilteredProjects] =
    useState<ProjectDirectoryEntry[]>(projects);

  const handleFilteredProjectsChange = (filtered: ProjectDirectoryEntry[]) => {
    setFilteredProjects(filtered);
  };

  return (
    <>
      <Card className="border border-divider shadow-lg">
        <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-2">
            <ProjectsSearch
              projects={projects}
              onFilteredProjectsChange={handleFilteredProjectsChange}
            />
          </div>
          <ProjectsViewTabs
            defaultView={view}
            projectsCount={filteredProjects.length}
          />
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
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardBody className="text-center">
            <p className="text-lg font-semibold">No projects found</p>
            <p className="mt-2 text-default-500">
              Try selecting a different school or clear the filter to see all
              projects.
            </p>
          </CardBody>
        </Card>
      ) : view === "map" ? (
        <MapView projects={filteredProjects} />
      ) : (
        <ListView projects={filteredProjects} />
      )}
    </>
  );
}
