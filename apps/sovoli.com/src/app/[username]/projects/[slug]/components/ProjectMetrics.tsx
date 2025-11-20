import { Card } from "@sovoli/ui/components/card";
import { Progress } from "@sovoli/ui/components/progress";
import { DollarSign, Package, Users, TrendingUp } from "lucide-react";
import type { Project } from "~/modules/projects/types";

interface ProjectMetricsProps {
  project: Project;
}

// Calculate metrics from project data
function calculateMetrics(project: Project) {
  const needs = project.needs ?? [];

  // Calculate total raised based on needs
  // For now, using placeholder values: roof = 2mil JMD, door = 20k JMD
  let totalRaised = 0;
  let targetRaised = 0;

  needs.forEach((need) => {
    if (need.slug === "sandybankinfant-industrial-sheeting-2025") {
      targetRaised += 2000000; // 2mil JMD for roof
    } else if (need.slug === "sandybankinfant-exterior-door-2025") {
      targetRaised += 20000; // 20k JMD for door
    }
  });

  // For demo purposes, assume some progress (66.8% to match example)
  totalRaised = Math.round(targetRaised * 0.668);

  // Calculate project progress (65% to match example)
  const projectProgress = 65;

  // Placeholder values for volunteers
  const volunteersPledged = 47;
  const targetVolunteers = 60;

  // Items funded (18 out of 24 to match example)
  const itemsFunded = 18;
  const totalItems = 24;

  return {
    totalRaised: {
      value: formatCurrency(totalRaised),
      target: formatCurrency(targetRaised),
      progress: targetRaised > 0 ? (totalRaised / targetRaised) * 100 : 0,
    },
    projectProgress: {
      value: `${projectProgress}%`,
      target: "Complete",
      progress: projectProgress,
    },
    volunteers: {
      value: volunteersPledged.toString(),
      target: "People",
      progress: (volunteersPledged / targetVolunteers) * 100,
    },
    itemsFunded: {
      value: itemsFunded.toString(),
      target: `${totalItems} Items`,
      progress: (itemsFunded / totalItems) * 100,
    },
  };
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}k`;
  }
  return `$${amount.toLocaleString()}`;
}

export function ProjectMetrics({ project }: ProjectMetricsProps) {
  const metricsData = calculateMetrics(project);

  const metrics = [
    {
      label: "Total Raised",
      value: metricsData.totalRaised.value,
      target: metricsData.totalRaised.target,
      icon: DollarSign,
      progress: metricsData.totalRaised.progress,
    },
    {
      label: "Project Progress",
      value: metricsData.projectProgress.value,
      target: metricsData.projectProgress.target,
      icon: TrendingUp,
      progress: metricsData.projectProgress.progress,
    },
    {
      label: "Volunteers",
      value: metricsData.volunteers.value,
      target: metricsData.volunteers.target,
      icon: Users,
      progress: metricsData.volunteers.progress,
    },
    {
      label: "Items Funded",
      value: metricsData.itemsFunded.value,
      target: metricsData.itemsFunded.target,
      icon: Package,
      progress: metricsData.itemsFunded.progress,
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className="p-3 flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-lg font-bold text-foreground leading-none">
                      {metric.value}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      / {metric.target}
                    </span>
                  </div>
                </div>
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
              </div>
              <Progress value={metric.progress} className="h-1.5" />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
