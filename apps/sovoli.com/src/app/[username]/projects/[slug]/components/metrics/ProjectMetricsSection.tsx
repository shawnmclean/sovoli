"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@sovoli/ui/components/card";
import { Progress } from "@sovoli/ui/components/progress";
import { Chip } from "@sovoli/ui/components/chip";
import { TrendingUp, CircleDot } from "lucide-react";
import type { Project, ProjectStatus } from "~/modules/projects/types";

interface ProjectMetricsSectionProps {
  project: Project;
  progress?: number;
}

const STATUS_CONFIG: Record<
  ProjectStatus,
  {
    label: string;
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  }
> = {
  planned: { label: "Planned", color: "default" },
  active: { label: "In Progress", color: "primary" },
  completed: { label: "Completed", color: "success" },
  cancelled: { label: "Cancelled", color: "danger" },
};

export function ProjectMetricsSection({
  progress = 0,
}: ProjectMetricsSectionProps) {
  const pathname = usePathname();
  const metricsHref = `${pathname}/metrics`;

  const status = "active";
  const statusConfig = STATUS_CONFIG[status];

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
              <span className="text-sm font-semibold tabular-nums">{progress}%</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
