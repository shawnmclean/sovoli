"use client";

import { Card } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Progress } from "@sovoli/ui/components/progress";
import { CircleDot, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Need } from "~/modules/needs/types";
import type { Project, ProjectStatus } from "~/modules/projects/types";

interface ProjectMetricsSectionProps {
  project: Project;
}

const STATUS_CONFIG: Record<
  ProjectStatus,
  {
    label: string;
    color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger";
  }
> = {
  planned: { label: "Planned", color: "default" },
  active: { label: "In Progress", color: "primary" },
  completed: { label: "Completed", color: "success" },
  cancelled: { label: "Cancelled", color: "danger" },
};

function getNeedQuantity(need: Need): number {
  if (need.type === "human") {
    return need.headcount ?? need.quantity ?? 1;
  }
  return need.quantity ?? 1;
}

function getNeedFulfilledQuantity(need: Need): number {
  const totalQuantity = getNeedQuantity(need);
  const isFulfilled = need.status === "fulfilled";
  return need.fulfillment?.quantityMet ?? (isFulfilled ? totalQuantity : 0);
}

/** Calculate progress based on fulfilled quantities across all needs */
function calculateProgress(project: Project): number {
  let totalQuantity = 0;
  let fulfilledQuantity = 0;

  const addNeeds = (needs: Need[]) => {
    for (const need of needs) {
      totalQuantity += getNeedQuantity(need);
      fulfilledQuantity += getNeedFulfilledQuantity(need);
    }
  };

  if (project.needs) {
    addNeeds(project.needs);
  }

  if (project.phases) {
    for (const phase of project.phases) {
      if (phase.needs) {
        addNeeds(phase.needs);
      }
    }
  }

  return totalQuantity > 0
    ? Math.round((fulfilledQuantity / totalQuantity) * 100)
    : 0;
}

export function ProjectMetricsSection({ project }: ProjectMetricsSectionProps) {
  const pathname = usePathname();
  const metricsHref = `${pathname}/metrics`;

  const status = project.status ?? "planned";
  const statusConfig = STATUS_CONFIG[status];
  const progress = calculateProgress(project);

  return (
    <Link href={metricsHref} className="block w-full">
      <Card className="p-4 hover:bg-content2/50 transition-colors cursor-pointer border-none bg-content1/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {/* Status Chip */}
          <Chip
            startContent={<CircleDot className="w-3 h-3" />}
            variant="dot"
            color={statusConfig.color}
            size="sm"
          >
            {statusConfig.label}
          </Chip>

          {/* Progress Section */}
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1">
              <Progress
                value={progress}
                size="sm"
                color="primary"
                className="max-w-full"
                aria-label="Project progress"
              />
            </div>
            <div className="flex items-center gap-1.5 text-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-semibold tabular-nums">
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
