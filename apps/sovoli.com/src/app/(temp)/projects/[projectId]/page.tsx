import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClipboardListIcon,
  MapPinIcon,
  TagIcon,
} from "lucide-react";

import { WhatsAppLink } from "~/components/WhatsAppLink";
import { config } from "~/utils/config";
import { ProjectGalleryCarousel } from "../components/ProjectGalleryCarousel";
import { getProjectById } from "../lib/projectsData";
import { formatDate, formatTimeline } from "../lib/formatters";
import {
  getPriorityBadgeClass,
  getPriorityLabel,
  getPriorityTextClass,
} from "../lib/priorities";

interface ProjectDetailsPageProps {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailsPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  if (!project) {
    return {
      title: "Project not found | Sovoli",
    };
  }

  return {
    title: `${project.title} | ${project.orgName}`,
    description:
      project.description ??
      "Explore the latest recovery projects shared by school leaders on Sovoli.",
  };
}

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  if (!project) {
    notFound();
  }

  const timeline = formatTimeline(project.startDate, project.endDate);
  const updatedAt = formatDate(project.updatedAt ?? project.createdAt);
  const needsCount = project.needs.length;
  const whatsappMessage = `Hi Sovoli team, I'd like to pledge supplies for ${project.title} at ${project.orgName}.`;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <ProjectGalleryCarousel photos={project.photos} title={project.title} />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-3">
          <Button
            as={Link}
            href="/projects"
            variant="light"
            startContent={<ArrowLeftIcon className="h-4 w-4" />}
            className="pointer-events-auto bg-background/80 text-foreground backdrop-blur"
          >
            Back to projects
          </Button>
        </div>

        <div className="absolute bottom-6 left-6 z-20">
          <span
            className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide shadow-lg ${getPriorityBadgeClass(
              project.priority,
            )}`}
          >
            {getPriorityLabel(project.priority)}
          </span>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
        <section className="rounded-3xl bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {project.orgName}
                </p>
                <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
                  {project.title}
                </h1>
              </div>
              {project.description && (
                <p className="text-lg text-default-600">
                  {project.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {project.locationLabel && (
                  <span className="inline-flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    {project.locationLabel}
                  </span>
                )}
                {timeline && (
                  <span className="inline-flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
                    {timeline}
                  </span>
                )}
                {updatedAt && (
                  <span className="inline-flex items-center gap-2">
                    <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
                    Updated {updatedAt}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                as={WhatsAppLink}
                phoneNumber={config.contact.whatsapp}
                message={whatsappMessage}
                color="primary"
                className="w-full"
                size="lg"
                event="Contact"
                eventProperties={{
                  source: "project-details",
                  project_id: project.projectId,
                  org_username: project.orgUsername,
                }}
              >
                <SiWhatsapp className="h-4 w-4" />
                <span className="ml-2">Message to pledge support</span>
              </Button>
              <Button
                as={Link}
                href={`/${project.orgUsername}`}
                variant="bordered"
                className="w-full"
              >
                Visit organisation profile
              </Button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Card className="rounded-3xl shadow-sm">
            <CardBody className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <AlertCircleIcon className="h-4 w-4" />
                Linked needs
                <span className="text-muted-foreground">({needsCount})</span>
              </div>
              {needsCount === 0 ? (
                <p className="text-muted-foreground">
                  School leaders are still finalizing the scoped needs for this
                  project.
                </p>
              ) : (
                <ul className="space-y-3">
                  {project.needs.map((need) => (
                    <li
                      key={need.slug}
                      className="rounded-2xl border border-divider bg-muted px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-foreground">
                            {need.title}
                          </p>
                          {need.quantity && (
                            <p className="text-sm text-muted-foreground">
                              Quantity: {need.quantity}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {need.type} - {need.item.category.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardBody className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <TagIcon className="h-4 w-4" />
                Project details
              </div>
              <dl className="space-y-3 text-sm text-default-600">
                {project.status && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="font-medium text-foreground capitalize">
                      {project.status}
                    </dd>
                  </div>
                )}
                {project.category && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium text-foreground capitalize">
                      {project.category}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Priority</dt>
                  <dd
                    className={`font-semibold uppercase tracking-wide ${getPriorityTextClass(
                      project.priority,
                    )}`}
                  >
                    {getPriorityLabel(project.priority)}
                  </dd>
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div>
                    <dt className="text-muted-foreground">Tags</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {project.notes && (
                  <div>
                    <dt className="text-muted-foreground">Coordinator notes</dt>
                    <dd className="mt-2 rounded-2xl bg-muted p-3 text-default-600">
                      {project.notes}
                    </dd>
                  </div>
                )}
              </dl>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
