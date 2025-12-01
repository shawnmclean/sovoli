"use client";

import { usePathname } from "next/navigation";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Link } from "@sovoli/ui/components/link";
import { CircularProgress } from "@sovoli/ui/components/progress";
import { ArrowRight } from "lucide-react";
import type { Project, ProjectPhase } from "~/modules/projects/types";
import type { Need, NeedType } from "~/modules/needs/types";
import { pluralize } from "~/utils/pluralize";

interface ProjectPhasesSectionProps {
  project: Project;
}

const NEED_TYPE_CONFIG: Record<NeedType, string> = {
  material: "Material",
  service: "Service",
  human: "Volunteer",
  financial: "Funding",
  job: "Job",
};

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
  if (need.type === "human" && need.headcount && need.fulfillment?.quantityMet !== undefined) {
    return Math.round((need.fulfillment.quantityMet / need.headcount) * 100);
  }

  // For financial needs, calculate from amounts
  if (need.type === "financial" && need.targetAmount && need.fulfillment?.amountRaised) {
    // Get the first currency key from target
    const currency = Object.keys(need.targetAmount)[0] as keyof typeof need.targetAmount | undefined;
    const raisedAmount = currency ? need.fulfillment.amountRaised[currency] : undefined;
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

interface NeedTypeSummary {
  type: NeedType;
  count: number;
  fulfilledCount: number;
  averageProgress: number;
}

/** Group needs by type and calculate aggregate progress */
function calculateNeedsSummaryByType(needs: Need[]): NeedTypeSummary[] {
  const typeOrder: NeedType[] = ["material", "service", "human", "financial", "job"];
  
  const summaryMap = needs.reduce<Partial<Record<NeedType, { count: number; totalProgress: number; fulfilledCount: number }>>>((acc, need) => {
    const type = need.type;
    const progress = calculateNeedProgress(need);
    const isFulfilled = need.status === "fulfilled";
    
    acc[type] ??= { count: 0, totalProgress: 0, fulfilledCount: 0 };
    
    acc[type].count += 1;
    acc[type].totalProgress += progress;
    if (isFulfilled) {
      acc[type].fulfilledCount += 1;
    }
    
    return acc;
  }, {});

  return typeOrder
    .filter((type) => summaryMap[type])
    .map((type) => {
      const data = summaryMap[type];
      if (!data) return null;
      return {
        type,
        count: data.count,
        fulfilledCount: data.fulfilledCount,
        averageProgress: Math.round(data.totalProgress / data.count),
      };
    })
    .filter((item): item is NeedTypeSummary => item !== null);
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

  // Calculate needs summary by type with progress
  const needsSummary = calculateNeedsSummaryByType(needs);

  // Calculate overall phase progress
  const totalProgress = needs.length > 0
    ? Math.round(needs.reduce((sum, need) => sum + calculateNeedProgress(need), 0) / needs.length)
    : 0;
  const isPhaseComplete = status === "completed" || totalProgress === 100;
  
  // Show "Help Wanted!" when phase is not complete and has unfulfilled needs
  const needsHelp = !isPhaseComplete && needs.some((need) => need.status !== "fulfilled");

  return (
    <Card
      as={Link}
      href={`${basePath}/phases/${phase.slug}`}
      className="shadow-sm hover:shadow-md transition-shadow"
    >
      <CardBody className="pb-2">
        {/* Title row with phase number, help chip, and progress */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h4
              className={`font-semibold ${
                status === "completed" ? "text-default-400 line-through" : ""
              }`}
            >
              <span className={`mr-1.5 ${isPhaseComplete ? "text-success" : "text-default-500"}`}>
                {index + 1}.
              </span>
              {phase.title}
            </h4>
            {needsHelp && (
              <Chip size="sm" color="warning" variant="flat" className="shrink-0">
                Help Wanted!
              </Chip>
            )}
          </div>
          {needs.length > 0 && (
            <span className={`text-sm font-medium tabular-nums shrink-0 ${isPhaseComplete ? "text-success" : "text-default-500"}`}>
              {totalProgress}%
            </span>
          )}
        </div>

        {phase.description && (
          <p className="text-sm text-default-500 line-clamp-2 mt-1">
            {phase.description}
          </p>
        )}
      </CardBody>
      <CardFooter className="flex items-center justify-between pt-0">
        {/* Needs summary by type with circular progress */}
        {needsSummary.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {needsSummary.map((summary) => {
              const label = NEED_TYPE_CONFIG[summary.type];
              const isComplete = summary.averageProgress === 100;
              return (
                <div
                  key={summary.type}
                  className="flex items-center gap-2"
                >
                  <div className="relative">
                    <CircularProgress
                      value={summary.averageProgress}
                      size="sm"
                      color={isComplete ? "success" : "default"}
                      classNames={{
                        svg: "w-8 h-8",
                        track: "stroke-default-200",
                      }}
                      aria-label={`${pluralize(summary.count, label)} progress`}
                      showValueLabel={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-[10px] font-semibold tabular-nums ${isComplete ? "text-success" : "text-default-600"}`}>
                        {summary.fulfilledCount}/{summary.count}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-default-600">
                    {pluralize(summary.count, label)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div />
        )}

        {/* View Details */}
        <span className="flex items-center gap-1 text-sm text-default-500 shrink-0">
          View Details
          <ArrowRight className="w-4 h-4" />
        </span>
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
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Project Phases</h3>
        <span className="text-xs text-default-500">
          {completedCount}/{phases.length} completed
        </span>
      </div>

      <div className="space-y-2">
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
  );
}

