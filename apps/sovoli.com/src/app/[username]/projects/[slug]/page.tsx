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

import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { config } from "~/utils/config";
import { slugify } from "~/utils/slugify";
import { ProjectGalleryCarousel } from "~/app/(temp)/projects/components/ProjectGalleryCarousel";
import {
  formatDate,
  formatTimeline,
} from "~/app/(temp)/projects/lib/formatters";
import {
  getPriorityBadgeClass,
  getPriorityLabel,
  getPriorityTextClass,
} from "~/app/(temp)/projects/lib/priorities";
import type { OrgLocation } from "~/modules/organisations/types";
import type { Need } from "~/modules/needs/types";
import type { ProjectNeedSummary } from "~/app/(temp)/projects/types";
import type { Item } from "~/modules/core/items/types";
import type { Project, ProjectsModule } from "~/modules/projects/types";

interface ProjectDetailsPageProps {
  params: Promise<{ username: string; slug: string }>;
}

const retrieveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

function findProjectBySlug(
  projectsModule: ProjectsModule | null | undefined,
  slug: string,
): Project | null {
  if (!projectsModule) return null;

  return (
    projectsModule.projects.find(
      (project) => slugify(project.title) === slug || project.id === slug,
    ) ?? null
  );
}

function resolveProjectLocation(
  locationKey: string | undefined,
  orgInstance: { org: { locations: OrgLocation[] } },
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

function summarizeNeeds(needs: Need[]): ProjectNeedSummary[] {
  return needs
    .filter((need): need is Need & { type: "material"; item: Item } => {
      return need.type === "material" && "item" in need;
    })
    .map((need) => {
      const materialNeed = need as Need & { type: "material"; item: Item };
      return {
        slug: materialNeed.slug,
        title: materialNeed.title,
        quantity: materialNeed.quantity,
        type: materialNeed.type,
        status: materialNeed.status,
        priority: materialNeed.priority,
        item: materialNeed.item,
      };
    });
}

export async function generateMetadata({
  params,
}: ProjectDetailsPageProps): Promise<Metadata> {
  const { username, slug } = await params;
  const orgInstance = await retrieveOrgInstance(username);
  const project = findProjectBySlug(orgInstance.projectsModule, slug);

  if (!project) {
    return {
      title: "Project not found | Sovoli",
    };
  }

  return {
    title: `${project.title} | ${orgInstance.org.name}`,
    description:
      project.description ??
      "Explore the latest recovery projects shared by school leaders on Sovoli.",
  };
}

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { username, slug } = await params;
  const orgInstance = await retrieveOrgInstance(username);
  const project = findProjectBySlug(orgInstance.projectsModule, slug);

  if (!project) {
    notFound();
  }

  const location = resolveProjectLocation(project.locationKey, orgInstance);
  const fallbackPhotos = orgInstance.org.photos ?? [];
  const photos =
    project.photos && project.photos.length > 0
      ? project.photos
      : fallbackPhotos;

  const timeline = formatTimeline(project.startDate, project.endDate);
  const updatedAt = formatDate(project.updatedAt ?? project.createdAt);
  const needsCount = project.needs?.length ?? 0;
  const whatsappMessage = `Hi Sovoli team, I'd like to pledge supplies for ${project.title} at ${orgInstance.org.name}.`;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <ProjectGalleryCarousel photos={photos} title={project.title} />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-3">
          <Button
            as={Link}
            href={`/${username}`}
            variant="light"
            startContent={<ArrowLeftIcon className="h-4 w-4" />}
            className="pointer-events-auto bg-background/80 text-foreground backdrop-blur"
          >
            Back to profile
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
                  {orgInstance.org.name}
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
                {location?.label && (
                  <span className="inline-flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    {location.label}
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
                  project_id: project.id,
                  org_username: username,
                }}
              >
                <SiWhatsapp className="h-4 w-4" />
                <span className="ml-2">Message to pledge support</span>
              </Button>
              <Button
                as={Link}
                href={`/${username}`}
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
                  {summarizeNeeds(project.needs ?? []).map((need) => (
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
                      {project.tags.map((tag: string) => (
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
