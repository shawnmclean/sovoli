"use client";

import { useMemo } from "react";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { ArrowRightIcon } from "lucide-react";

import type { ProjectDirectoryEntry } from "../types";
import { formatDate } from "../lib/formatters";
import { getPriorityLabel, getPriorityTextClass } from "../lib/priorities";
import { ProjectCarousel } from "./ProjectCarousel";
import { slugify } from "~/utils/slugify";
interface ListViewProps {
  projects: ProjectDirectoryEntry[];
}

export function ListView({ projects }: ListViewProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardBody className="text-center">
          <p className="text-lg font-semibold">No projects to show yet</p>
          <p className="mt-2 text-muted-foreground">
            As soon as recovery initiatives go live you&apos;ll see them listed
            here.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </div>
  );
}

function ProjectListItem({ project }: { project: ProjectDirectoryEntry }) {
  const needsCount = project.needs.length;
  const photos = useMemo(() => project.photos, [project.photos]);
  const projectSlug = slugify(project.title);
  const projectHref = `/${project.orgUsername}/projects/${projectSlug}`;

  // Format address following ProjectOrgBadgeSection pattern
  const addressParts = [
    project.locationAddressLine1,
    project.locationCity,
    project.locationState,
  ].filter(Boolean);

  const addressString = addressParts.join(", ");

  return (
    <Card className="group overflow-hidden border border-divider shadow-sm transition duration-200 hover:shadow-2xl">
      <div className="relative w-full min-h-[320px] overflow-hidden rounded-2xl">
        <ProjectCarousel
          photos={photos}
          title={project.title}
          href={projectHref}
        />
        <div className="absolute top-3 left-3 z-20">
          <div className="rounded-full border border-foreground/20 bg-background/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground backdrop-blur-sm shadow-lg">
            <span className={getPriorityTextClass(project.priority)}>
              {getPriorityLabel(project.priority)}
            </span>
          </div>
        </div>
      </div>

      <CardBody className="space-y-4">
        <Link
          href={projectHref}
          className="block space-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`View project ${project.title}`}
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold leading-tight text-foreground">
              {project.title}
            </h2>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {project.orgName}
              </p>
              {addressString && (
                <p className="text-xs text-foreground-500">{addressString}</p>
              )}
            </div>
            {project.description && (
              <p className="text-default-600 line-clamp-3">
                {project.description}
              </p>
            )}
          </div>

          {needsCount > 0 && (
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {project.needs.slice(0, 4).map((need) => (
                <li key={need.slug}>
                  <span className="text-foreground">{need.title}</span>
                  {need.quantity && <span> ({need.quantity})</span>}
                </li>
              ))}
              {project.needs.length > 4 && (
                <li className="list-none text-xs pt-1">
                  +{project.needs.length - 4} more
                </li>
              )}
            </ul>
          )}
        </Link>
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t border-divider bg-muted text-sm text-muted-foreground">
        <span>
          Updated{" "}
          {formatDate(project.updatedAt ?? project.createdAt) ?? "recently"}
        </span>
        <Link
          href={projectHref}
          className="flex items-center gap-1 text-primary transition hover:gap-2"
        >
          View impact
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
