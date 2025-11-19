import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import {
  AlertCircleIcon,
  ClipboardListIcon,
  TagIcon,
  UserIcon,
  CalendarIcon,
} from "lucide-react";

import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { config } from "~/utils/config";
import { slugify } from "~/utils/slugify";
import { GalleryCarousel } from "~/components/GalleryCarousel";
import { formatDate } from "~/app/(temp)/projects/lib/formatters";
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
import { ProjectDetailNavbar } from "./components/ProjectDetailNavbar";
import { OrgBadgeSection } from "~/components/OrgBadgeSection";
import { ProjectHeroSection } from "./components/ProjectHeroSection";

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

function getBackHref(referer: string | null, username: string): string {
  if (!referer) {
    return `/${username}`;
  }

  try {
    const refererUrl = new URL(referer);
    const refererPath = refererUrl.pathname;

    // If coming from projects listing page
    if (refererPath === "/projects" || refererPath.startsWith("/projects/")) {
      return "/projects";
    }

    // If coming from org profile page
    if (
      refererPath === `/${username}` ||
      refererPath.startsWith(`/${username}/`)
    ) {
      return `/${username}`;
    }

    // Default to org profile
    return `/${username}`;
  } catch {
    // If URL parsing fails, default to org profile
    return `/${username}`;
  }
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

  const headersList = await headers();
  const referer = headersList.get("referer");
  const backHref = getBackHref(referer, username);

  const location = resolveProjectLocation(project.locationKey, orgInstance);
  const fallbackPhotos = orgInstance.org.photos ?? [];
  const photos =
    project.photos && project.photos.length > 0
      ? project.photos
      : fallbackPhotos;

  const updatedAt = formatDate(project.updatedAt ?? project.createdAt);
  const needsCount = project.needs?.length ?? 0;
  const whatsappMessage = `Hi Sovoli team, I'd like to pledge supplies for ${project.title} at ${orgInstance.org.name}.`;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <GalleryCarousel photos={photos} title={project.title} />

        <ProjectDetailNavbar
          orgInstance={orgInstance}
          project={project}
          backHref={backHref}
        />

        <div className="absolute bottom-4 left-4 z-20 sm:bottom-6 sm:left-6">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-lg sm:px-4 ${getPriorityBadgeClass(
              project.priority,
            )}`}
          >
            {getPriorityLabel(project.priority)}
          </span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        <ProjectHeroSection
          orgInstance={orgInstance}
          project={project}
          location={location}
        />

        <div className="mb-6 sm:mb-8">
          <OrgBadgeSection orgInstance={orgInstance} />
        </div>

        {project.description && (
          <section className="mb-6 rounded-2xl bg-card p-4 shadow-sm sm:mb-8 sm:rounded-3xl sm:p-6">
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-default-600 sm:text-lg">
                {project.description}
              </p>
              {updatedAt && (
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <ClipboardListIcon className="h-4 w-4" />
                    Updated {updatedAt}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Card className="rounded-2xl shadow-sm sm:rounded-3xl">
            <CardBody className="space-y-4 p-4 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
                <AlertCircleIcon className="h-4 w-4" />
                Needs
                <span className="text-muted-foreground">({needsCount})</span>
              </div>
              {needsCount === 0 ? (
                <p className="text-sm text-muted-foreground sm:text-base">
                  School leaders are still finalizing the scoped needs for this
                  project.
                </p>
              ) : (
                <ul className="space-y-3">
                  {summarizeNeeds(project.needs ?? []).map((need) => (
                    <li
                      key={need.slug}
                      className="rounded-xl border border-divider bg-muted px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground sm:text-base">
                            {need.title}
                          </p>
                          {need.quantity && (
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                              Quantity: {need.quantity}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-2">
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
                  <span className="ml-2">Volunteer/Donate</span>
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="rounded-2xl shadow-sm sm:rounded-3xl">
            <CardBody className="space-y-4 p-4 sm:p-6">
              <div className="space-y-3">
                <Button
                  as={WhatsAppLink}
                  phoneNumber={config.contact.whatsapp}
                  message={`Hi Sovoli team, I'd like to view the coordinator for ${project.title} at ${orgInstance.org.name}.`}
                  color="default"
                  variant="bordered"
                  className="w-full"
                  size="lg"
                  event="Contact"
                  eventProperties={{
                    source: "project-details",
                    project_id: project.id,
                    org_username: username,
                    cta_type: "view_coordinator",
                  }}
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="ml-2">View Coordinator</span>
                </Button>

                <Button
                  as={WhatsAppLink}
                  phoneNumber={config.contact.whatsapp}
                  message={`Hi Sovoli team, I'd like to view the detailed recovery plan & timelines for ${project.title} at ${orgInstance.org.name}.`}
                  color="default"
                  variant="bordered"
                  className="w-full"
                  size="lg"
                  event="Contact"
                  eventProperties={{
                    source: "project-details",
                    project_id: project.id,
                    org_username: username,
                    cta_type: "view_recovery_plan",
                  }}
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span className="ml-2">
                    View Detailed Recovery Plan & Timelines
                  </span>
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="rounded-2xl shadow-sm sm:rounded-3xl">
            <CardBody className="space-y-4 p-4 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
                <TagIcon className="h-4 w-4" />
                Project details
              </div>
              <dl className="space-y-3 text-sm text-default-600">
                {project.status && (
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="font-medium text-foreground capitalize sm:text-right">
                      {project.status}
                    </dd>
                  </div>
                )}
                {project.category && (
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium text-foreground capitalize sm:text-right">
                      {project.category}
                    </dd>
                  </div>
                )}
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <dt className="text-muted-foreground">Priority</dt>
                  <dd
                    className={`font-semibold uppercase tracking-wide sm:text-right ${getPriorityTextClass(
                      project.priority,
                    )}`}
                  >
                    {getPriorityLabel(project.priority)}
                  </dd>
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div>
                    <dt className="mb-2 text-muted-foreground">Tags</dt>
                    <dd className="flex flex-wrap gap-2">
                      {project.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground sm:px-3"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {project.notes && (
                  <div>
                    <dt className="mb-2 text-muted-foreground">
                      Coordinator notes
                    </dt>
                    <dd className="rounded-xl bg-muted p-3 text-sm text-default-600 sm:rounded-2xl sm:text-base">
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
