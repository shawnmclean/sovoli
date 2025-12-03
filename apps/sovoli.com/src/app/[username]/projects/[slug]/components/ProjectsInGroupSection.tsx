"use client";

import type { Project, ProjectGroup } from "~/modules/projects/types";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Need, NeedType } from "~/modules/needs/types";
import type { Item } from "~/modules/core/items/types";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Link } from "@sovoli/ui/components/link";
import { Divider } from "@sovoli/ui/components/divider";
import { CldImage } from "next-cloudinary";
import { slugify } from "~/utils/slugify";
import { ArrowRight, Package, Users, Wrench, DollarSign, Briefcase, FolderOpen } from "lucide-react";
import { CircularProgress, Progress } from "@sovoli/ui/components/progress";
import { ORGS } from "~/modules/data/organisations";
import { pluralize } from "~/utils/pluralize";

export interface ProjectsInGroupSectionProps {
  orgInstance: OrgInstance;
  project?: Project;
  group: ProjectGroup;
}

/** Need type icons and labels */
const NEED_TYPE_CONFIG: Record<NeedType, { icon: typeof Package; label: string }> = {
  material: { icon: Package, label: "Materials" },
  service: { icon: Wrench, label: "Services" },
  human: { icon: Users, label: "Volunteers" },
  financial: { icon: DollarSign, label: "Funding" },
  job: { icon: Briefcase, label: "Jobs" },
};

/** Calculate fulfillment progress for a single need (0-100) */
function calculateNeedProgress(need: Need): number {
  if (need.status === "fulfilled") return 100;
  if (need.fulfillment?.progress !== undefined) {
    return Math.min(100, Math.max(0, need.fulfillment.progress));
  }
  if (need.quantity && need.fulfillment?.quantityMet !== undefined) {
    return Math.round((need.fulfillment.quantityMet / need.quantity) * 100);
  }
  if (need.type === "human" && need.headcount && need.fulfillment?.quantityMet !== undefined) {
    return Math.round((need.fulfillment.quantityMet / need.headcount) * 100);
  }
  if (need.type === "financial" && need.targetAmount && need.fulfillment?.amountRaised) {
    const currency = Object.keys(need.targetAmount)[0] as keyof typeof need.targetAmount | undefined;
    const raisedAmount = currency ? need.fulfillment.amountRaised[currency] : undefined;
    if (currency && raisedAmount !== undefined) {
      const target = need.targetAmount[currency] ?? 0;
      if (target > 0) return Math.round((raisedAmount / target) * 100);
    }
  }
  if (need.status === "in-progress" || need.status === "ordered") return 50;
  if (need.status === "approved") return 25;
  return 0;
}

/** Calculate overall project progress from all needs */
function calculateProjectProgress(project: Project): number {
  const allNeeds: Need[] = [];

  // Collect project-level needs
  if (project.needs) {
    allNeeds.push(...project.needs);
  }

  // Collect phase needs
  if (project.phases) {
    for (const phase of project.phases) {
      if (phase.needs) {
        allNeeds.push(...phase.needs);
      }
    }
  }

  if (allNeeds.length === 0) {
    return project.status === "completed" ? 100 : 0;
  }

  const totalProgress = allNeeds.reduce((sum, need) => sum + calculateNeedProgress(need), 0);
  return Math.round(totalProgress / allNeeds.length);
}

/** Count needs by type for a project (including phase needs) */
function countNeedsByType(project: Project): Record<NeedType, number> {
  const counts: Record<NeedType, number> = {
    material: 0,
    service: 0,
    human: 0,
    financial: 0,
    job: 0,
  };

  // Count project-level needs
  if (project.needs) {
    for (const need of project.needs) {
      counts[need.type]++;
    }
  }

  // Count phase needs
  if (project.phases) {
    for (const phase of project.phases) {
      if (phase.needs) {
        for (const need of phase.needs) {
          counts[need.type]++;
        }
      }
    }
  }

  return counts;
}

/** Get total needs count */
function getTotalNeedsCount(counts: Record<NeedType, number>): number {
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
}

/** Calculate estimated cost for a project */
function calculateEstimatedCost(project: Project, orgInstance: OrgInstance): number {
  const allNeeds: Need[] = [];

  if (project.needs) allNeeds.push(...project.needs);
  if (project.phases) {
    for (const phase of project.phases) {
      if (phase.needs) allNeeds.push(...phase.needs);
    }
  }

  let totalCost = 0;

  const recommendedSuppliers =
    orgInstance.org.supplierRecommendations
      ?.map((rec) => ORGS.find((org) => org.org.username === rec.org.username))
      .filter((org): org is OrgInstance => org !== undefined) ?? [];

  for (const need of allNeeds) {
    if (need.procurement?.estimatedCost) {
      totalCost += need.procurement.estimatedCost;
      continue;
    }

    if (need.type === "material" && "item" in need) {
      const materialNeed = need as Need & { type: "material"; item: Item };
      const itemId = materialNeed.item.id;

      for (const supplierOrg of recommendedSuppliers) {
        if (supplierOrg.catalogModule?.items) {
          const catalogItem = supplierOrg.catalogModule.items.find(
            (item) => item.id === itemId,
          );
          if (catalogItem) {
            const price =
              catalogItem.price.JMD ?? catalogItem.price.GYD ?? catalogItem.price.USD ?? 0;
            totalCost += price * (need.quantity ?? 1);
            break;
          }
        }
      }
    }
  }

  return totalCost;
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
  return `$${amount.toLocaleString()}`;
}

function ProjectCard({
  project,
  orgInstance,
}: {
  project: Project;
  orgInstance: OrgInstance;
}) {
  const projectSlug = slugify(project.title);
  const projectHref = `/${orgInstance.org.username}/projects/${projectSlug}`;

  // Get first image from project or phases
  const firstImage =
    project.media?.find((m) => m.type === "image") ??
    project.phases?.flatMap((p) => p.media ?? []).find((m) => m.type === "image");

  const progress = calculateProjectProgress(project);
  const needsCounts = countNeedsByType(project);
  const totalNeeds = getTotalNeedsCount(needsCounts);
  const estimatedCost = calculateEstimatedCost(project, orgInstance);
  const isComplete = project.status === "completed" || progress === 100;

  // Get needs summary for display
  const needsSummary = (Object.entries(needsCounts) as [NeedType, number][])
    .filter(([, count]) => count > 0)
    .slice(0, 3);

  return (
    <Card
      as={Link}
      href={projectHref}
    >
      {/* Image Section */}
      <div className="relative aspect-[16/9] bg-default-100">
        {firstImage?.publicId ? (
          <>
            <CldImage
              src={firstImage.publicId}
              alt={firstImage.alt ?? project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              crop="fill"
              quality="auto"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-default-200 to-default-100">
            <FolderOpen className="h-12 w-12 text-default-400" />
          </div>
        )}

        {/* Progress indicator overlay */}
        {totalNeeds > 0 && (
          <div className="absolute bottom-3 right-3">
            <div className="relative">
              <CircularProgress
                value={progress}
                size="md"
                color={isComplete ? "success" : "primary"}
                classNames={{
                  svg: "w-12 h-12 drop-shadow-lg",
                  track: "stroke-white/30",
                  indicator: "stroke-white",
                }}
                aria-label={`${project.title} progress`}
                showValueLabel={false}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-md">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <CardBody className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {project.title}
        </h3>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-default-500 line-clamp-2 mb-3">
            {project.description}
          </p>
        )}

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <Progress
              size="sm"
              color={isComplete ? "success" : "primary"}
              value={progress}
              aria-label={`${project.title} completion`}
              className="flex-1"
            />
            <span className="text-xs font-semibold text-default-600 w-10 text-right">
              {progress}%
            </span>
          </div>
        </div>
      </CardBody>

      <CardFooter className="flex w-full border-t border-default-100 px-4 py-3">
        <div className="flex w-full items-center justify-between gap-3">
          {/* Needs summary */}
          {needsSummary.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {needsSummary.map(([type, count]) => {
                const config = NEED_TYPE_CONFIG[type];
                const Icon = config.icon;
                return (
                  <div
                    key={type}
                    className="flex items-center gap-1.5 rounded-md bg-default-100 px-2 py-1 text-xs text-default-600"
                  >
                    <Icon className="h-3 w-3" />
                    <span>
                      {count} {pluralize(count, config.label.slice(0, -1))}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="text-xs text-default-500">
              {totalNeeds} {pluralize(totalNeeds, "need")}
            </span>
          )}

          <div className="flex items-center gap-2 text-default-400">
            {estimatedCost > 0 && (
              <span className="text-sm font-medium text-success">{formatCurrency(estimatedCost)}</span>
            )}
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export const ProjectsInGroupSection = ({
  orgInstance,
  project,
  group,
}: ProjectsInGroupSectionProps) => {
  if (!group.projects || group.projects.length === 0) {
    return null;
  }

  // If only one project in group and we're viewing that project, don't show
  if (group.projects.length <= 1 && project) {
    return null;
  }

  const projectsInGroup = group.projects;
  const projectCount = projectsInGroup.length;

  return (
    <>
      <Divider className="my-6 sm:my-8" />
      <section className="mb-6 sm:mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight">
              Projects
            </h2>
            <Chip size="sm" variant="flat" radius="lg">
              {projectCount}
            </Chip>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsInGroup.map((p) => (
            <ProjectCard key={p.id} project={p} orgInstance={orgInstance} />
          ))}
        </div>
      </section>
    </>
  );
};

