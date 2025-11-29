"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Project, ProjectPhase, PhaseNeed } from "~/modules/projects/types";

interface ProjectPhasesSectionProps {
  project: Project;
}

function NeedRow({ need }: { need: PhaseNeed }) {
  const isFulfilled = need.status === "fulfilled";
  const isPartial = need.status === "partially-fulfilled";

  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <div className="flex min-w-0 flex-col">
        <span className={`text-xs ${isFulfilled ? "text-default-400 line-through" : ""}`}>
          {need.title}
        </span>
        {need.fulfillments?.length ? (
          <span className="text-[10px] text-default-500">
            {isFulfilled
              ? `${need.fulfillments.length} helped`
              : isPartial
                ? `${need.fulfillments.length} partial`
                : null}
          </span>
        ) : null}
      </div>

      {!isFulfilled && (
        <button
          type="button"
          className="shrink-0 rounded bg-primary px-2 py-0.5 text-[10px] text-white"
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
        className="flex w-full items-center gap-2 p-3 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        {/* Phase number */}
        <span className={`w-5 shrink-0 text-xs ${isCompleted ? "text-success" : isActive ? "text-primary font-medium" : "text-default-400"}`}>
          {index + 1}.
        </span>

        {/* Title */}
        <span className={`min-w-0 flex-1 text-sm ${isCompleted ? "text-default-400 line-through" : ""}`}>
          {phase.title}
        </span>

        {/* Expand indicator */}
        {hasContent && (
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-default-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && hasContent && (
        <div className="space-y-2 px-3 pb-3 pl-8">
          {phase.description && (
            <p className="text-xs text-default-500">{phase.description}</p>
          )}

          {hasNeeds && (
            <div className="space-y-1">
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
