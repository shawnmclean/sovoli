import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { TagIcon } from "lucide-react";

import { Footer } from "~/components/footer/Footer";
import { GalleryCarousel } from "~/components/GalleryCarousel";
import {
  getPriorityBadgeClass,
  getPriorityLabel,
  getPriorityTextClass,
} from "~/app/(temp)/projects/lib/priorities";
import type { OrgLocation } from "~/modules/organisations/types";
import type { Project, ProjectGroup } from "~/modules/projects/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { ProjectDetailNavbar } from "./components/ProjectDetailNavbar";
import { ProjectHeroSection } from "./components/ProjectHeroSection";
import { ProjectOrgBadgeSection } from "./components/ProjectOrgBadgeSection";
import { ProjectDetailMobileFooter } from "./components/ProjectDetailMobileFooter";
import { ProjectMetricsSection } from "./components/metrics/ProjectMetricsSection";
import { ProjectCoordinators } from "./components/ProjectCoordinators";
import { ProjectCartProvider } from "./context/ProjectCartContext";
import { NavigationDrawer } from "~/app/(tenants)/w/[username]/components/NavigationDrawer";
import { ProjectTracking } from "./components/ProjectTracking";
import { ProjectGroupTracking } from "./components/ProjectGroupTracking";
import { ProjectsInGroupSection } from "./components/ProjectsInGroupSection";
import { ProjectPhasesSection } from "./components/phases/ProjectPhasesSection";
import { ProjectNeedsSection } from "./components/needs/ProjectNeedsSection";
import { getOrgInstanceWithProject } from "./lib/getOrgInstanceWithProject";

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string; slug: string }>;
  modals: React.ReactNode;
}

const retrieveOrgInstanceWithProject = async (
  username: string,
  slug: string,
): Promise<{
  orgInstance: OrgInstance;
  project?: Project;
  group?: ProjectGroup;
}> => {
  const result = await getOrgInstanceWithProject(username, slug);
  if (!result) {
    notFound();
  }
  return result;
};

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

function parseTimestamp(value?: string | null): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function getProjectCreationTimestamp(project?: Project) {
  if (!project) return null;
  return parseTimestamp(project.createdAt) ?? parseTimestamp(project.updatedAt);
}

function getProjectUpdatedTimestamp(project?: Project) {
  if (!project) return null;
  return parseTimestamp(project.updatedAt) ?? parseTimestamp(project.createdAt);
}

function getEarliestProjectByCreation(projects?: Project[]) {
  if (!projects || projects.length === 0) return undefined;
  return projects.reduce<Project | undefined>((earliest, project) => {
    if (!earliest) return project;
    const earliestTimestamp = getProjectCreationTimestamp(earliest) ?? Number.POSITIVE_INFINITY;
    const projectTimestamp = getProjectCreationTimestamp(project) ?? Number.POSITIVE_INFINITY;
    return projectTimestamp < earliestTimestamp ? project : earliest;
  }, undefined);
}

function getLatestProjectByUpdate(projects?: Project[]) {
  if (!projects || projects.length === 0) return undefined;
  return projects.reduce<Project | undefined>((latest, project) => {
    if (!latest) return project;
    const latestTimestamp = getProjectUpdatedTimestamp(latest) ?? Number.NEGATIVE_INFINITY;
    const projectTimestamp = getProjectUpdatedTimestamp(project) ?? Number.NEGATIVE_INFINITY;
    return projectTimestamp > latestTimestamp ? project : latest;
  }, undefined);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = await params;
  const result = await retrieveOrgInstanceWithProject(username, slug);

  const { orgInstance, project, group } = result;

  // Handle group case
  if (group) {
    const firstProject = group.projects?.[0];
    const fallbackMedia = orgInstance.org.media ?? [];
    const media =
      firstProject?.media && firstProject.media.length > 0
        ? firstProject.media
        : fallbackMedia;

    const ogImage = media[0]?.url;
    const description =
      group.description ??
      "Explore the latest recovery projects shared by school leaders on Sovoli.";

    return {
      title: `${group.name} | ${orgInstance.org.name}`,
      description,
      openGraph: {
        title: `${group.name} | ${orgInstance.org.name}`,
        description,
        images: ogImage ? [{ url: ogImage }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${group.name} | ${orgInstance.org.name}`,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  }

  // Handle individual project case
  if (project) {
    const fallbackMedia = orgInstance.org.media ?? [];
    const media =
      project.media && project.media.length > 0
        ? project.media
        : fallbackMedia;

    const ogImage = media[0]?.url;
    const description =
      project.description ??
      "Explore the latest recovery projects shared by school leaders on Sovoli.";

    return {
      title: `${project.title} | ${orgInstance.org.name}`,
      description,
      openGraph: {
        title: `${project.title} | ${orgInstance.org.name}`,
        description,
        images: ogImage ? [{ url: ogImage }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${project.title} | ${orgInstance.org.name}`,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  }

  return {
    title: "Project not found | Sovoli",
  };
}

export default async function Layout({ children, params, modals }: Props) {
  const { username, slug } = await params;
  const result = await retrieveOrgInstanceWithProject(username, slug);

  const { orgInstance, project, group } = result;

  // Handle group case
  if (group) {
    const firstProject = group.projects?.[0];
    if (!firstProject) {
      notFound();
    }
    const earliestProjectForCreated = getEarliestProjectByCreation(group.projects);
    const latestProjectForUpdated = getLatestProjectByUpdate(group.projects);
    const createdTimestamp =
      earliestProjectForCreated?.createdAt ?? earliestProjectForCreated?.updatedAt;
    const updatedTimestamp =
      latestProjectForUpdated?.updatedAt ?? latestProjectForUpdated?.createdAt;

    const location = resolveProjectLocation(
      firstProject.locationKey,
      orgInstance,
    );
    const fallbackMedia = orgInstance.org.media ?? [];
    const media =
      firstProject.media && firstProject.media.length > 0
        ? firstProject.media
        : fallbackMedia;

    return (
      <ProjectCartProvider>
        <div className="min-h-screen">
          <div className="relative">
            <GalleryCarousel
              media={media}
              title={group.name}
              type="project"
              username={username}
              id={group.id}
            />

            <ProjectDetailNavbar
              title={group.name}
              orgName={orgInstance.org.name}
              backHref="/projects"
            />
          </div>

          <NavigationDrawer fallbackPath={`/projects/${slug}`}>
            {modals}
          </NavigationDrawer>

          <ProjectGroupTracking group={group} />

          <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
            <ProjectOrgBadgeSection
              orgInstance={orgInstance}
              location={location}
            />

            <ProjectHeroSection
              title={group.name}
              description={group.description}
              createdAt={createdTimestamp}
              updatedAt={updatedTimestamp}
            />

            <ProjectsInGroupSection
              orgInstance={orgInstance}
              group={group}
            />
          </main>

          {children}

          <Footer />
        </div>
      </ProjectCartProvider>
    );
  }

  // Handle individual project case
  if (!project) {
    notFound();
  }

  const location = resolveProjectLocation(project.locationKey, orgInstance);
  const fallbackMedia = orgInstance.org.media ?? [];
  const media =
    project.media && project.media.length > 0
      ? project.media
      : fallbackMedia;

  const projectGroup = project.group;

  // Determine back href: if project is part of a group, go to group page, otherwise go to projects listing
  const backHref = projectGroup
    ? `/${username}/projects/${projectGroup.slug}`
    : "/projects";

  return (
    <ProjectCartProvider>
      <div className="min-h-screen">
        <div className="relative">
          <GalleryCarousel
            media={media}
            title={project.title}
            type="project"
            username={username}
            id={project.id}
          />

          <ProjectDetailNavbar
            title={project.title}
            orgName={orgInstance.org.name}
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

        <NavigationDrawer fallbackPath={`/projects/${slug}`}>
          {modals}
        </NavigationDrawer>

        <ProjectTracking project={project} />

        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
          <ProjectOrgBadgeSection
            orgInstance={orgInstance}
            location={location}
          />
          <ProjectMetricsSection project={project} />
          <ProjectHeroSection
            title={project.title}
            description={project.description}
            createdAt={project.createdAt}
            updatedAt={project.updatedAt}
          />

          <ProjectPhasesSection project={project} />

          <ProjectNeedsSection project={project} />

          {projectGroup && (
            <section className="mb-6 rounded-2xl bg-card p-4 shadow-sm sm:mb-8 sm:rounded-3xl sm:p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Part of project group
                </p>
                <p className="text-base font-semibold text-foreground sm:text-lg">
                  {projectGroup.name}
                </p>
                {projectGroup.description && (
                  <p className="text-sm text-default-600">
                    {projectGroup.description}
                  </p>
                )}
              </div>
            </section>
          )}

          {projectGroup && (
            <ProjectsInGroupSection
              orgInstance={orgInstance}
              project={project}
              group={projectGroup}
            />
          )}

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <ProjectCoordinators project={project} orgInstance={orgInstance} />

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

        <ProjectDetailMobileFooter
          orgInstance={orgInstance}
          project={project}
          username={username}
        />

        {children}

        <Footer />
      </div>
    </ProjectCartProvider>
  );
}
