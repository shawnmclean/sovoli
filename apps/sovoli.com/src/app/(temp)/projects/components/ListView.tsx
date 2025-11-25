"use client";

import { useMemo } from "react";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { ArrowRightIcon, DollarSign } from "lucide-react";

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

// Calculate project funding metrics from needs
function calculateProjectMetrics(project: ProjectDirectoryEntry) {
  const needs = project.needs;

  // Calculate total raised based on needs
  // Using placeholder values: roof = 2mil JMD, door = 20k JMD
  let totalRaised = 0;
  let targetRaised = 0;

  needs.forEach((need) => {
    if (need.slug === "sandybankinfant-industrial-sheeting-2025") {
      targetRaised += 2000000; // 2mil JMD for roof
    } else if (need.slug === "sandybankinfant-exterior-door-2025") {
      targetRaised += 20000; // 20k JMD for door
    }
  });

  // For demo purposes, assume some progress (66.8% to match example)
  totalRaised = Math.round(targetRaised * 0.668);

  return {
    totalRaised,
    targetRaised,
    progress: targetRaised > 0 ? (totalRaised / targetRaised) * 100 : 0,
  };
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}k`;
  }
  return `$${amount.toLocaleString()}`;
}

function ProjectListItem({ project }: { project: ProjectDirectoryEntry }) {
  const needsCount = project.needs.length;
  const photos = useMemo(() => project.photos, [project.photos]);
  const projectSlug = slugify(project.title);
  const projectHref = `/${project.orgUsername}/projects/${projectSlug}`;
  const metrics = useMemo(() => calculateProjectMetrics(project), [project]);

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
          <div className="space-y-3">
            {/* School name - prioritized */}
            <div>
              <h3 className="text-xl font-bold text-foreground leading-tight">
                {project.orgName}
              </h3>
              {addressString && (
                <p className="text-xs text-muted-foreground mt-1">
                  {addressString}
                </p>
              )}
            </div>

            {/* Project title */}
            <h2 className="text-lg font-semibold leading-tight text-foreground">
              {project.title}
            </h2>

            {/* Amount section */}
            {metrics.targetRaised > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-divider">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(metrics.totalRaised)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      / {formatCurrency(metrics.targetRaised)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {Math.round(metrics.progress)}% funded
                  </p>
                </div>
              </div>
            )}

            {project.description && (
              <p className="text-default-600 line-clamp-2 text-sm">
                {project.description}
              </p>
            )}
          </div>

          {needsCount > 0 && (
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {project.needs.slice(0, 3).map((need) => (
                <li key={need.slug}>
                  <span className="text-foreground">{need.title}</span>
                  {need.quantity && <span> ({need.quantity})</span>}
                </li>
              ))}
              {project.needs.length > 3 && (
                <li className="list-none text-xs pt-1">
                  +{project.needs.length - 3} more
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
          More Details
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
