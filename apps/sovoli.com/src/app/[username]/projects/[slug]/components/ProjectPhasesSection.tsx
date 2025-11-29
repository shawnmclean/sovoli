"use client";

import { CheckCircle2, Circle, Clock, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Project, ProjectPhase, PhaseNeed } from "~/modules/projects/types";

interface ProjectPhasesSectionProps {
  project: Project;
}

function NeedRow({ need }: { need: PhaseNeed }) {
  const isFulfilled = need.status === "fulfilled";
  const isPartial = need.status === "partially-fulfilled";

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-default-200 p-2">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-xs font-medium">{need.title}</span>
        {need.fulfillments?.length ? (
          <span className="text-[10px] text-default-500">
            {isFulfilled
              ? `Fulfilled by ${need.fulfillments.length} contributor(s)`
              : isPartial
                ? `Partially fulfilled: ${need.fulfillments.length}`
                : null}
          </span>
        ) : (
          <span className="text-[10px] text-default-400">Needed</span>
        )}
      </div>

      {!isFulfilled && (
        <button
          type="button"
          className="shrink-0 rounded bg-primary px-2 py-1 text-xs text-white"
        >
          Help
        </button>
      )}
    </div>
  );
}

function PhaseItem({ phase, index }: { phase: ProjectPhase; index: number }) {
  const [isExpanded, setIsExpanded] = useState(phase.status === "active");
  const hasNeeds = phase.needs && phase.needs.length > 0;
  const hasDescription = Boolean(phase.description);
  const hasContent = hasNeeds ? true : hasDescription;
  const isActive = phase.status === "active";
  const isCompleted = phase.status === "completed";

  return (
    <div className={`border-b border-default-200 last:border-b-0 ${isActive ? "bg-primary/5" : ""}`}>
      <button
        type="button"
        className="flex w-full items-center gap-3 p-3 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        {/* Status indicator */}
        <div className="shrink-0">
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : isActive ? (
            <Clock className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-default-300" />
          )}
        </div>

        {/* Title and status */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-default-400">{index + 1}.</span>
            <span className={`truncate text-sm font-medium ${isCompleted ? "text-default-500 line-through" : ""}`}>
              {phase.title}
            </span>
          </div>
        </div>

        {/* Expand indicator */}
        {hasContent && (
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-default-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && hasContent && (
        <div className="space-y-3 px-3 pb-3 pl-11">
          {phase.description && (
            <p className="text-xs text-default-600">{phase.description}</p>
          )}

          {hasNeeds && (
            <div className="space-y-2">
              {phase.needs?.map((need) => (
                <NeedRow key={need.id} need={need} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectPhasesSection({ project }: ProjectPhasesSectionProps) {
  const phases = project.phases;

  if (!phases || phases.length === 0) {
    return null;
  }

  const completedCount = phases.filter((p) => p.status === "completed").length;

  return (
    <section className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Phases</h3>
        <span className="text-xs text-default-500">
          {completedCount}/{phases.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-default-200">
        {phases.map((phase, index) => (
          <PhaseItem key={`phase-${index}`} phase={phase} index={index} />
        ))}
      </div>
    </section>
  );
}
