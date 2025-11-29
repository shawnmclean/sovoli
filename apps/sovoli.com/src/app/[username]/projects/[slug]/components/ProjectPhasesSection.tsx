"use client";

import { Card, CardBody } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import {
  CheckCircle2,
  Circle,
  Clock,
  Wrench,
  Package,
  Users,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import type { Project, ProjectPhase, PhaseNeed } from "~/modules/projects/types";

interface ProjectPhasesSectionProps {
  project: Project;
}

function getPhaseStatusIcon(status?: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    case "active":
      return <Clock className="h-5 w-5 text-primary animate-pulse" />;
    case "cancelled":
      return <Circle className="h-5 w-5 text-danger" />;
    default:
      return <Circle className="h-5 w-5 text-default-400" />;
  }
}

function getPhaseStatusLabel(status?: string) {
  switch (status) {
    case "completed":
      return "Completed";
    case "active":
      return "In Progress";
    case "cancelled":
      return "Cancelled";
    default:
      return "Planned";
  }
}

function getPhaseStatusColor(status?: string) {
  switch (status) {
    case "completed":
      return "success" as const;
    case "active":
      return "primary" as const;
    case "cancelled":
      return "danger" as const;
    default:
      return "default" as const;
  }
}

function getNeedTypeIcon(type: PhaseNeed["type"]) {
  switch (type) {
    case "material":
      return <Package className="h-4 w-4" />;
    case "service":
      return <Wrench className="h-4 w-4" />;
    case "labor":
      return <Users className="h-4 w-4" />;
    case "financial":
      return <DollarSign className="h-4 w-4" />;
    default:
      return <Circle className="h-4 w-4" />;
  }
}

function getNeedStatusColor(status: PhaseNeed["status"]) {
  switch (status) {
    case "fulfilled":
      return "success" as const;
    case "in-progress":
      return "primary" as const;
    case "cancelled":
      return "danger" as const;
    default:
      return "warning" as const;
  }
}

function PhaseNeedItem({ need }: { need: PhaseNeed }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-default-100/50 p-3">
      <div className="mt-0.5 text-default-500">
        {getNeedTypeIcon(need.type)}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm">{need.title}</span>
          <Chip
            size="sm"
            variant="flat"
            color={getNeedStatusColor(need.status)}
            className="text-[10px] h-5"
          >
            {need.status === "in-progress" ? "In Progress" : need.status}
          </Chip>
        </div>
        {need.description && (
          <p className="text-xs text-default-500 leading-relaxed">
            {need.description}
          </p>
        )}
        <div className="flex items-center gap-2 pt-1">
          <Chip size="sm" variant="bordered" className="text-[10px] h-5 capitalize">
            {need.type}
          </Chip>
        </div>
      </div>
    </div>
  );
}

function PhaseCard({
  phase,
  index,
  total,
}: {
  phase: ProjectPhase;
  index: number;
  total: number;
}) {
  const [isExpanded, setIsExpanded] = useState(phase.status === "active");
  const hasNeeds = phase.needs && phase.needs.length > 0;
  const isActive = phase.status === "active";

  return (
    <div className="relative">
      {/* Timeline connector */}
      {index < total - 1 && (
        <div className="absolute left-[19px] top-12 h-[calc(100%-2rem)] w-0.5 bg-default-200" />
      )}

      <div className="flex gap-4">
        {/* Phase number and status icon */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
              isActive
                ? "border-primary bg-primary/10"
                : phase.status === "completed"
                  ? "border-success bg-success/10"
                  : "border-default-300 bg-background"
            }`}
          >
            {phase.status === "completed" ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <span
                className={`text-sm font-semibold ${
                  isActive ? "text-primary" : "text-default-500"
                }`}
              >
                {index + 1}
              </span>
            )}
          </div>
        </div>

        {/* Phase content */}
        <Card
          className={`flex-1 mb-4 transition-all ${
            isActive ? "border-primary/50 shadow-md" : ""
          }`}
        >
          <CardBody className="p-4">
            <button
              type="button"
              className="flex w-full cursor-pointer items-start justify-between gap-4 text-left"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-label={`${phase.title} - ${isExpanded ? "Collapse" : "Expand"} phase details`}
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-base">{phase.title}</span>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={getPhaseStatusColor(phase.status)}
                    startContent={getPhaseStatusIcon(phase.status)}
                    className="text-xs"
                  >
                    {getPhaseStatusLabel(phase.status)}
                  </Chip>
                </div>
                {phase.description && (
                  <p className="text-sm text-default-600 leading-relaxed">
                    {phase.description}
                  </p>
                )}
              </div>

              {hasNeeds && (
                <span
                  className="shrink-0 rounded-full p-1 hover:bg-default-100"
                  aria-hidden="true"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-default-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-default-500" />
                  )}
                </span>
              )}
            </button>

            {/* Phase needs */}
            {hasNeeds && isExpanded && (
              <div className="mt-4 space-y-2 border-t border-default-200 pt-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-default-500">
                  <Package className="h-3.5 w-3.5" />
                  Requirements ({phase.needs?.length})
                </div>
                <div className="space-y-2">
                  {phase.needs?.map((need) => (
                    <PhaseNeedItem key={need.id} need={need} />
                  ))}
                </div>
              </div>
            )}

            {/* Show "No requirements" if phase has no needs */}
            {!hasNeeds && isExpanded && (
              <div className="mt-4 border-t border-default-200 pt-4">
                <p className="text-sm text-default-400 italic">
                  No specific requirements for this phase
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export function ProjectPhasesSection({ project }: ProjectPhasesSectionProps) {
  const phases = project.phases;

  if (!phases || phases.length === 0) {
    return null;
  }

  // Calculate progress
  const completedCount = phases.filter((p) => p.status === "completed").length;
  const activeCount = phases.filter((p) => p.status === "active").length;
  const progressPercent = Math.round((completedCount / phases.length) * 100);

  return (
    <section className="mb-8 sm:mb-12">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              Project Phases
            </h2>
            <p className="text-sm text-default-500 mt-1">
              {completedCount} of {phases.length} phases completed
              {activeCount > 0 && ` • ${activeCount} in progress`}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-3">
            <div className="h-2 w-32 overflow-hidden rounded-full bg-default-200">
              <div
                className="h-full bg-success transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-medium text-default-600">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Phases timeline */}
      <div className="space-y-0">
        {phases.map((phase, index) => (
          <PhaseCard
            key={`phase-${index}-${phase.title}`}
            phase={phase}
            index={index}
            total={phases.length}
          />
        ))}
      </div>
    </section>
  );
}

