"use client";

import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Link } from "@sovoli/ui/components/link";
import { Progress } from "@sovoli/ui/components/progress";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import type { Need, NeedType } from "~/modules/needs/types";
import { NEED_TYPE_CONFIG } from "~/modules/needs/utils";
import type { Project, ProjectPhase } from "~/modules/projects/types";
import { pluralize } from "~/utils/pluralize";

interface ProjectPhasesSectionProps {
  project: Project;
}

/** Calculate fulfillment progress for a single need (0-100) */
function calculateNeedProgress(need: Need): number {
  // If explicitly fulfilled, return 100%
  if (need.status === "fulfilled") {
    return 100;
  }

  // If there's a direct progress value, use it
  if (need.fulfillment?.progress !== undefined) {
    return Math.min(100, Math.max(0, need.fulfillment.progress));
  }

  // Calculate based on quantity
  if (need.quantity && need.fulfillment?.quantityMet !== undefined) {
    return Math.round((need.fulfillment.quantityMet / need.quantity) * 100);
  }

  // For human needs, use headcount
  if (
    need.type === "human" &&
    need.headcount &&
    need.fulfillment?.quantityMet !== undefined
  ) {
    return Math.round((need.fulfillment.quantityMet / need.headcount) * 100);
  }

  // For financial needs, calculate from amounts
  if (
    need.type === "financial" &&
    need.targetAmount &&
    need.fulfillment?.amountRaised
  ) {
    // Get the first currency key from target
    const currency = Object.keys(need.targetAmount)[0] as
      | keyof typeof need.targetAmount
      | undefined;
    const raisedAmount = currency
      ? need.fulfillment.amountRaised[currency]
      : undefined;
    if (currency && raisedAmount !== undefined) {
      const target = need.targetAmount[currency] ?? 0;
      if (target > 0) {
        return Math.round((raisedAmount / target) * 100);
      }
    }
  }

  // Default: 0% if no fulfillment data, or estimate based on status
  if (need.status === "in-progress" || need.status === "ordered") {
    return 50; // Mid-way estimate
  }
  if (need.status === "approved") {
    return 25;
  }

  return 0;
}

/** Count needs by type with fulfillment info */
interface NeedTypeStats {
  total: number;
  fulfilled: number;
}

function countNeedsByType(needs: Need[]): Record<NeedType, NeedTypeStats> {
  const counts: Record<NeedType, NeedTypeStats> = {
    material: { total: 0, fulfilled: 0 },
    service: { total: 0, fulfilled: 0 },
    human: { total: 0, fulfilled: 0 },
    financial: { total: 0, fulfilled: 0 },
    job: { total: 0, fulfilled: 0 },
  };

  for (const need of needs) {
    counts[need.type].total++;
    const progress = calculateNeedProgress(need);
    if (progress === 100) {
      counts[need.type].fulfilled++;
    }
  }

  return counts;
}

function getTotalNeedsCount(counts: Record<NeedType, NeedTypeStats>): {
  total: number;
  fulfilled: number;
} {
  return Object.values(counts).reduce(
    (acc, stats) => ({
      total: acc.total + stats.total,
      fulfilled: acc.fulfilled + stats.fulfilled,
    }),
    { total: 0, fulfilled: 0 },
  );
}

function PhaseCard({
  phase,
  index,
  basePath,
}: {
  phase: ProjectPhase;
  index: number;
  basePath: string;
}) {
  const status = phase.status ?? "planned";
  const needs = phase.needs ?? [];

  // Calculate overall phase progress
  const totalProgress =
    needs.length > 0
      ? Math.round(
          needs.reduce((sum, need) => sum + calculateNeedProgress(need), 0) /
            needs.length,
        )
      : 0;
  const isPhaseComplete = status === "completed" || totalProgress === 100;
  const needsCounts = countNeedsByType(needs);
  const totalNeedsStats = getTotalNeedsCount(needsCounts);
  const needsSummary = (
    Object.entries(needsCounts) as [NeedType, NeedTypeStats][]
  )
    .filter(([, stats]) => stats.total > 0)
    .slice(0, 3);

  return (
    <Card as={Link} href={`${basePath}/phases/${phase.slug}`}>
      <CardBody className="p-4">
        {/* Title */}
        <h3
          className={`text-lg font-semibold text-foreground mb-1 ${status === "completed" ? "text-default-400 line-through" : ""}`}
        >
          <span
            className={`mr-2 text-sm font-medium ${isPhaseComplete ? "text-success" : "text-default-500"}`}
          >
            {index + 1}.
          </span>
          {phase.title}
        </h3>

        {/* Description */}
        {phase.description && (
          <p className="text-sm text-default-500 line-clamp-2 mb-3">
            {phase.description}
          </p>
        )}

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <Progress
              size="sm"
              color={isPhaseComplete ? "success" : "primary"}
              value={totalProgress}
              aria-label={`${phase.title} completion`}
              className="flex-1"
            />
            <span className="text-xs font-semibold text-default-600 w-10 text-right">
              {totalProgress}%
            </span>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex w-full border-t border-default-100 px-4 py-3">
        <div className="flex w-full items-center justify-between gap-3">
          {/* Needs summary with fulfillment */}
          {needsSummary.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {needsSummary.map(([type, stats]) => {
                const config = NEED_TYPE_CONFIG[type];
                const Icon = config.icon;
                const hasFulfilled = stats.fulfilled > 0;
                return (
                  <div
                    key={type}
                    className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs ${config.bgColor}`}
                  >
                    <Icon className={`h-3 w-3 ${config.textColor}`} />
                    <span className={config.textColor}>
                      {hasFulfilled
                        ? `${stats.fulfilled}/${stats.total}`
                        : stats.total}{" "}
                      {pluralize(stats.total, config.label)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="text-xs text-default-500">
              {totalNeedsStats.fulfilled > 0
                ? `${totalNeedsStats.fulfilled}/${totalNeedsStats.total} ${pluralize(totalNeedsStats.total, "need")} funded`
                : `${totalNeedsStats.total} ${pluralize(totalNeedsStats.total, "need")}`}
            </span>
          )}

          {/* Arrow indicator */}
          <span className="text-default-400 shrink-0">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export function ProjectPhasesSection({ project }: ProjectPhasesSectionProps) {
  const pathname = usePathname();
  const phases = project.phases;

  if (!phases || phases.length === 0) {
    return null;
  }

  const completedCount = phases.filter((p) => p.status === "completed").length;

  return (
    <>
      <Divider className="my-6 sm:my-8" />
      <section className="mb-6 sm:mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight">
            Project Roadmap
          </h2>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{phases.length} completed
          </span>
        </div>

        <div className="space-y-3">
          {phases.map((phase, index) => (
            <PhaseCard
              key={phase.slug}
              phase={phase}
              index={index}
              basePath={pathname}
            />
          ))}
        </div>
      </section>
    </>
  );
}
