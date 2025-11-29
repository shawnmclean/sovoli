"use client";

import type { Project, ProjectGroup } from "~/modules/projects/types";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Need } from "~/modules/needs/types";
import type { Item } from "~/modules/core/items/types";
import { Link } from "@sovoli/ui/components/link";
import { slugify } from "~/utils/slugify";
import { ChevronRight, Package, Users, Wrench, DollarSign, Briefcase } from "lucide-react";
import { CircularProgress } from "@sovoli/ui/components/progress";
import { ORGS } from "~/modules/data/organisations";
import { pluralize } from "~/utils/pluralize";

export interface ProjectsInGroupSectionProps {
  orgInstance: OrgInstance;
  project?: Project;
  group: ProjectGroup;
}

// Calculate estimated cost for a project
function calculateEstimatedCost(
  project: Project,
  orgInstance: OrgInstance,
): number {
  const needs = project.needs ?? [];
  let totalCost = 0;

  // Get recommended suppliers
  const recommendedSuppliers =
    orgInstance.org.supplierRecommendations
      ?.map((rec) => {
        const fullSupplierOrg = ORGS.find(
          (org) => org.org.username === rec.org.username,
        );
        return fullSupplierOrg;
      })
      .filter((org): org is OrgInstance => org !== undefined) ?? [];

  needs.forEach((need) => {
    // First check if need has procurement cost data
    if (need.procurement?.estimatedCost) {
      totalCost += need.procurement.estimatedCost;
      return;
    }

    // For material needs, try to get price from suppliers
    if (need.type === "material" && "item" in need) {
      const materialNeed = need as Need & { type: "material"; item: Item };
      const itemId = materialNeed.item.id;

      // Find supplier with this item
      for (const supplierOrg of recommendedSuppliers) {
        if (supplierOrg.catalogModule?.items) {
          const catalogItem = supplierOrg.catalogModule.items.find(
            (catalogItem) => catalogItem.id === itemId,
          );

          if (catalogItem) {
            const price =
              catalogItem.price.JMD ??
              catalogItem.price.GYD ??
              catalogItem.price.USD ??
              0;
            const quantity = need.quantity ?? 1;
            totalCost += price * quantity;
            return;
          }
        }
      }
    }
  });

  return totalCost;
}

// Format currency for display
function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  // For amounts under 1M, show full number with commas
  return `$${amount.toLocaleString()}`;
}

// Get status indicator styling
function getStatusIndicator(status?: string) {
  switch (status) {
    case "active":
      return {
        text: "Active",
        progressColor: "danger" as const,
      };
    case "planned":
      return {
        text: "Planned",
        progressColor: "warning" as const,
      };
    case "completed":
      return {
        text: "Completed",
        progressColor: "success" as const,
      };
    default:
      return {
        text: "Planned",
        progressColor: "default" as const,
      };
  }
}

// Count needs by type for a project
function countNeedsByType(project: Project) {
  const needs = project.needs ?? [];
  return {
    materials: needs.filter((n) => n.type === "material").length,
    labor: needs.filter((n) => n.type === "human" || n.type === "job").length,
    services: needs.filter((n) => n.type === "service").length,
    financial: needs.filter((n) => n.type === "financial").length,
    total: needs.length,
  };
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

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
          {projectsInGroup.length} {pluralize(projectsInGroup.length, "Project")} 
          </h2>
        </div>

        {/* Compact Phase List */}
        <div className="divide-y divide-default-200 rounded-lg border border-default-200 overflow-hidden">
          {projectsInGroup.map((p) => {
            const projectSlug = slugify(p.title);
            const estimatedCost = calculateEstimatedCost(p, orgInstance);
            const statusIndicator = getStatusIndicator(p.status);
            const needsCounts = countNeedsByType(p);

            // Mock progress - you can replace with actual calculation
            const progress = p.status === "completed" ? 100 : p.status === "active" ? 45 : 0;

            const hasStats = needsCounts.total > 0 || estimatedCost > 0;

            return (
              <Link
                key={p.id}
                href={`/${orgInstance.org.username}/projects/${projectSlug}`}
                className="block px-4 py-3 hover:bg-default-100 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {/* Circular Progress */}
                  <div className="flex-shrink-0">
                    <CircularProgress
                      value={progress}
                      color={statusIndicator.progressColor}
                      size="sm"
                      showValueLabel
                      aria-label={`${p.title} progress`}
                    />
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {p.title}
                    </h3>

                    {p.description && (
                      <p className="text-xs text-default-500 truncate mt-0.5">
                        {p.description}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-4 w-4 text-default-300 group-hover:text-default-500 transition-colors flex-shrink-0" />
                </div>

                {/* Stats Row */}
                {hasStats && (
                  <div className="flex items-center gap-4 mt-2 ml-12 text-default-400">
                    {needsCounts.materials > 0 && (
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span className="text-xs">{needsCounts.materials}</span>
                      </div>
                    )}
                    {needsCounts.labor > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="text-xs">{needsCounts.labor}</span>
                      </div>
                    )}
                    {needsCounts.services > 0 && (
                      <div className="flex items-center gap-1">
                        <Wrench className="h-3 w-3" />
                        <span className="text-xs">{needsCounts.services}</span>
                      </div>
                    )}
                    {needsCounts.financial > 0 && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        <span className="text-xs">{needsCounts.financial}</span>
                      </div>
                    )}
                    {estimatedCost > 0 && (
                      <div className="flex items-center gap-1 text-default-600">
                        <DollarSign className="h-3 w-3" />
                        <span className="text-xs font-medium">
                          {formatCurrency(estimatedCost)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

