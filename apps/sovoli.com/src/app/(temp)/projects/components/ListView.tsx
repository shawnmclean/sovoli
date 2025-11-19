"use client";

import { useMemo } from "react";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
} from "lucide-react";

import type { ProjectDirectoryEntry } from "../types";
import { formatTimeline, formatDate } from "../lib/formatters";
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
  const timeline = formatTimeline(project.startDate, project.endDate);
  const needsCount = project.needs.length;
  const photos = useMemo(() => project.photos, [project.photos]);
  const projectSlug = slugify(project.title);
  const projectHref = `/${project.orgUsername}/projects/${projectSlug}`;

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
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {project.orgName}
              {project.locationLabel && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <MapPinIcon className="h-3 w-3 text-muted-foreground" />
                  {project.locationLabel}
                </span>
              )}
            </p>
            {project.description && (
              <p className="text-default-600 line-clamp-3">
                {project.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {timeline && (
              <span className="inline-flex items-center gap-2">
                <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
                {timeline}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <AlertCircleIcon
                className={`h-4 w-4 ${getPriorityTextClass(project.priority)}`}
              />
              {needsCount > 0
                ? `${needsCount} scoped ${needsCount === 1 ? "need" : "needs"}`
                : "Needs in review"}
            </span>
          </div>

          {needsCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.needs.slice(0, 4).map((need) => (
                <span
                  key={need.slug}
                  className="inline-flex items-center gap-1 rounded-full border border-divider bg-muted px-3 py-1 text-xs font-medium text-foreground"
                >
                  {need.title}
                  {need.quantity && (
                    <span className="text-muted-foreground">
                      · {need.quantity}
                    </span>
                  )}
                </span>
              ))}
              {project.needs.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{project.needs.length - 4} more
                </span>
              )}
            </div>
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
