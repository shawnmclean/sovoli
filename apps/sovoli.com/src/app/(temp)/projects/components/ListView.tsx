"use client";

import { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@sovoli/ui/components/carousel";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { CldImage } from "next-cloudinary";
import {
  AlertCircleIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PackageIcon,
} from "lucide-react";

import type { ProjectDirectoryEntry } from "../types";
interface ListViewProps {
  projects: ProjectDirectoryEntry[];
}

export function ListView({ projects }: ListViewProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardBody className="text-center">
          <p className="text-lg font-semibold">No projects to show yet</p>
          <p className="mt-2 text-gray-500">
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

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm">
      <div className="grid gap-0 md:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
        <div className="relative min-h-[220px] bg-gray-100">
          {photos.length > 0 ? (
            <Carousel className="h-full">
              <CarouselContent className="h-full">
                {photos.map((photo, index) => (
                  <CarouselItem
                    key={`${project.id}-photo-${index}`}
                    className="h-full basis-full"
                  >
                    <div className="relative h-full w-full">
                      <CldImage
                        src={photo.publicId}
                        alt={photo.alt ?? project.title}
                        fill
                        sizes="(min-width: 768px) 40vw, 100vw"
                        className="h-full w-full object-cover"
                        priority={index === 0}
                      />
                      {photo.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 text-xs text-white">
                          {photo.caption}
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {photos.length > 1 && (
                <>
                  <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 bg-white/80" />
                  <CarouselNext className="right-3 top-1/2 -translate-y-1/2 bg-white/80" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500">
              <PackageIcon className="h-8 w-8" />
              <p className="mt-2 text-xs uppercase tracking-wide">
                Photos coming soon
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <CardBody className="space-y-5">
            {project.priority && (
              <Chip
                size="sm"
                variant="flat"
                color={getSeverityChipColor(project.priority)}
                className="uppercase tracking-wide"
              >
                {project.priority} priority
              </Chip>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold leading-tight">
                  {project.title}
                </h2>
                <Tooltip content="View the organisation profile">
                  <Button
                    as={Link}
                    href={`/${project.orgUsername}`}
                    variant="light"
                    size="sm"
                    radius="full"
                    startContent={<ArrowUpRightIcon className="h-4 w-4" />}
                  >
                    {project.orgName}
                  </Button>
                </Tooltip>
              </div>
              {project.description && (
                <p className="mt-2 text-gray-600">{project.description}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {project.locationLabel && (
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  {project.locationLabel}
                </span>
              )}
              {timeline && (
                <span className="inline-flex items-center gap-1">
                  <CalendarDaysIcon className="h-4 w-4" />
                  {timeline}
                </span>
              )}
            </div>

            {needsCount > 0 && (
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Linked needs ({needsCount})
                </p>
                <div className="mt-2 space-y-2">
                  {project.needs.slice(0, 4).map((need) => (
                    <div
                      key={need.slug}
                      className="flex items-center gap-2 rounded-md border border-gray-100 bg-white/60 px-3 py-2 text-sm text-gray-700 shadow-sm"
                    >
                      <AlertCircleIcon className="h-4 w-4 text-orange-500" />
                      <div className="flex flex-wrap gap-1">
                        <span className="font-medium text-gray-900">
                          {need.title}
                        </span>
                        {need.quantity && (
                          <span className="text-gray-500">
                            · {need.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {project.needs.length > 4 && (
                  <p className="mt-1 text-xs text-gray-400">
                    +{project.needs.length - 4} additional needs scoped
                  </p>
                )}
              </div>
            )}

            {project.notes && (
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                {project.notes}
              </div>
            )}
          </CardBody>

          <CardFooter className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <div>
              Last updated{" "}
              {formatDate(project.updatedAt ?? project.createdAt) ?? "recently"}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                as={Link}
                href={`/needs/new?projectId=${project.projectId}&org=${project.orgUsername}`}
                color="primary"
                startContent={<AlertCircleIcon className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                Pledge supplies
              </Button>
              <Button
                as={Link}
                href={`/${project.orgUsername}`}
                variant="bordered"
                startContent={<ArrowUpRightIcon className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                View organisation
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}

type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

function getSeverityChipColor(
  priority?: ProjectDirectoryEntry["priority"],
): ChipColor {
  if (!priority) return "primary";
  const normalized = priority.toLowerCase();

  if (normalized === "critical" || normalized === "emergency") {
    return "danger";
  }
  if (normalized === "high") {
    return "warning";
  }
  if (normalized === "medium") {
    return "secondary";
  }

  return "primary";
}

function formatTimeline(start?: string, end?: string) {
  const formattedStart = formatDate(start);
  const formattedEnd = formatDate(end);

  if (formattedStart && formattedEnd) {
    return `${formattedStart} – ${formattedEnd}`;
  }
  if (formattedStart) return `Starts ${formattedStart}`;
  if (formattedEnd) return `Complete by ${formattedEnd}`;

  return null;
}

function formatDate(value?: string) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
