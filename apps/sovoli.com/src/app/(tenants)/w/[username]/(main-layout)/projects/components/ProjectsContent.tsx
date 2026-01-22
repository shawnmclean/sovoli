"use client";

import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import { useState } from "react";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";
import type { Project } from "~/modules/projects/types";

interface ProjectsContentProps {
  orgInstance: OrgInstanceWithWebsite;
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTimeline(project: Project) {
  const start = formatDate(project.startDate);
  const end = formatDate(project.endDate);

  if (start && end) return `${start} – ${end}`;
  if (start) return `Starts ${start}`;
  if (end) return `Ends ${end}`;

  return "Timeline not set";
}

function formatStatus(status?: Project["status"]) {
  if (!status) return null;
  return status
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatPriority(priority?: Project["priority"]) {
  switch (priority) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return null;
  }
}

function formatCategory(category?: Project["category"]) {
  if (!category) return null;
  return category
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function getPriorityColor(priority?: Project["priority"]) {
  switch (priority) {
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
      return "default";
    default:
      return "default";
  }
}

function getStatusColor(status?: Project["status"]) {
  switch (status) {
    case "active":
      return "primary";
    case "completed":
      return "success";
    case "planned":
      return "warning";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
}

export function ProjectsContent({ orgInstance }: ProjectsContentProps) {
  const projectsModule = orgInstance.projectsModule;
  const projects = projectsModule?.projects ?? [];
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    null,
  );

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Organization Projects
            </h1>
            <p className="text-muted-foreground">
              There are no active projects for{" "}
              {orgInstance.websiteModule.website.siteName} at this time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const locationMap = new Map(
    orgInstance.org.locations.map((location) => [location.key, location]),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl space-y-6 px-3 py-6 sm:space-y-8 sm:px-4 sm:py-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Organization Projects
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Active initiatives at {orgInstance.websiteModule.website.siteName}.
          </p>
        </header>

        <div className="overflow-hidden rounded-xl border border-divider bg-card">
          <div className="hidden grid-cols-[minmax(0,2.4fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,120px)] gap-4 border-b border-divider bg-default-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
            <span>Project</span>
            <span>Timeline</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Needs</span>
            <span className="text-right">Details</span>
          </div>

          <div className="divide-y divide-divider">
            {projects.map((project) => {
              const isExpanded = expandedProjectId === project.id;
              const timeline = formatTimeline(project);
              const priorityLabel = formatPriority(project.priority);
              const statusLabel = formatStatus(project.status);
              const categoryLabel = formatCategory(project.category);
              const location = project.locationKey
                ? locationMap.get(project.locationKey)
                : undefined;
              const start = formatDate(project.startDate);
              const end = formatDate(project.endDate);
              const needs = project.needs ?? [];
              const createdAt = formatDate(project.createdAt);
              const updatedAt = formatDate(project.updatedAt);
              const hasAuditDates = Boolean(createdAt ?? updatedAt);

              return (
                <div
                  key={project.id}
                  className="transition-colors hover:bg-default-50"
                >
                  <div className="flex flex-col gap-3 px-4 py-4 text-sm text-muted-foreground md:grid md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,120px)] md:items-center md:gap-4 md:px-6 md:text-base">
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-foreground md:text-sm md:font-medium">
                        {project.title}
                      </p>
                      {categoryLabel && (
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {categoryLabel}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground md:hidden">
                        {timeline}
                      </p>
                    </div>

                    <div className="md:text-sm">
                      <span>{timeline}</span>
                    </div>

                    <div className="text-sm">
                      {priorityLabel ? (
                        <Chip
                          size="sm"
                          color={getPriorityColor(project.priority)}
                          variant="flat"
                        >
                          {priorityLabel}
                        </Chip>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>

                    <div className="text-sm">
                      {statusLabel ? (
                        <Chip
                          size="sm"
                          color={getStatusColor(project.status)}
                          variant="flat"
                        >
                          {statusLabel}
                        </Chip>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>

                    <div className="text-sm">
                      {needs.length > 0 ? (
                        <span>{needs.length}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() =>
                          setExpandedProjectId((prev) =>
                            prev === project.id ? null : project.id,
                          )
                        }
                      >
                        {isExpanded ? "Hide details" : "View details"}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-divider px-4 pb-5 pt-4 text-sm text-muted-foreground md:px-6 md:pt-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                            Overview
                          </h3>
                          {project.description ? (
                            <p className="leading-relaxed text-foreground">
                              {project.description}
                            </p>
                          ) : (
                            <p>No additional description provided.</p>
                          )}

                          {project.internal ? (
                            <Chip size="sm" color="primary" variant="bordered">
                              Internal Initiative
                            </Chip>
                          ) : null}

                          {project.notes && (
                            <p className="text-xs text-muted-foreground">
                              Notes: {project.notes}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                            Logistics
                          </h3>
                          {location ? (
                            <div className="space-y-1">
                              <p className="text-foreground">
                                {location.label ?? location.key}
                              </p>
                              {location.address.line1 && (
                                <p className="text-xs">
                                  {location.address.line1}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p>Location not specified.</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {start ? `Start: ${start}` : "Start date not set"}
                            {start && end ? " • " : " "}
                            {end ? `End: ${end}` : "End date not set"}
                          </p>
                        </div>
                      </div>

                      {needs.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                            Linked Needs
                          </h3>
                          <ul className="space-y-1 text-sm leading-relaxed text-foreground">
                            {needs.map((need) => {
                              const trimmedTitle = need.title.trim();
                              const needTitle =
                                trimmedTitle.length > 0
                                  ? trimmedTitle
                                  : need.title;
                              return (
                                <li key={need.slug} className="flex flex-col">
                                  <span className="font-medium">
                                    {needTitle}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {need.description ??
                                      need.description ??
                                      "No description provided."}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {hasAuditDates && (
                        <div className="mt-4 border-t border-divider pt-3 text-xs text-muted-foreground">
                          {createdAt && <span>Created: {createdAt}</span>}
                          {createdAt && updatedAt ? <span> • </span> : null}
                          {updatedAt ? <span>Updated: {updatedAt}</span> : null}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
