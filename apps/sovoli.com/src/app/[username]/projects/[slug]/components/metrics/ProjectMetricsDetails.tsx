"use client";

import { useEffect } from "react";
import {
  DrawerContent,
  DrawerHeader as DrawerHeaderComponent,
  DrawerBody as DrawerBodyComponent,
} from "@sovoli/ui/components/drawer";
import { Card } from "@sovoli/ui/components/card";
import { Progress } from "@sovoli/ui/components/progress";
import { Alert } from "@sovoli/ui/components/alert";
import { DollarSign, Package, Users, TrendingUp } from "lucide-react";
import type { Project } from "~/modules/projects/types";
import { trackProjectAnalytics } from "../../lib/projectAnalytics";

interface ProjectMetricsDetailsProps {
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

export function ProjectMetricsDetails({ project }: ProjectMetricsDetailsProps) {
  const metricsData = calculateMetrics(project);

  useEffect(() => {
    trackProjectAnalytics("SectionOpened", project, {
      section: "metrics",
    });
  }, [project]);

  const metricsArray = [
    {
      label: "Total Raised",
      value: metricsData.totalRaised.value,
      target: metricsData.totalRaised.target,
      icon: DollarSign,
      progress: metricsData.totalRaised.progress,
      description: "Total funds raised towards the project goal",
    },
    {
      label: "Project Progress",
      value: metricsData.projectProgress.value,
      target: metricsData.projectProgress.target,
      icon: TrendingUp,
      progress: metricsData.projectProgress.progress,
      description: "Overall completion status of the project",
    },
    {
      label: "Volunteers",
      value: metricsData.volunteers.value,
      target: metricsData.volunteers.target,
      icon: Users,
      progress: metricsData.volunteers.progress,
      description: "Number of volunteers committed to the project",
    },
    {
      label: "Items Funded",
      value: metricsData.itemsFunded.value,
      target: metricsData.itemsFunded.target,
      icon: Package,
      progress: metricsData.itemsFunded.progress,
      description: "Number of items that have been fully funded",
    },
  ];

  return (
    <DrawerContent>
      {(onClose) => (
        <>
          <DrawerHeaderComponent
            showBackButton
            onBackPress={onClose}
            title="Project Metrics"
          />
          <DrawerBodyComponent>
            <div className="space-y-6 pb-20">
              <Alert color="warning" variant="flat">
                <p className="text-sm font-medium">Under Development</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This feature is currently under development. Metrics shown are
                  for demonstration purposes.
                </p>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metricsArray.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <Card
                      key={index}
                      className="p-4 flex flex-col justify-between shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                              {metric.label}
                            </p>
                          </div>
                          <div className="flex items-baseline gap-1 mb-2">
                            <p className="text-2xl font-bold text-foreground leading-none">
                              {metric.value}
                            </p>
                            <span className="text-sm text-muted-foreground">
                              / {metric.target}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {metric.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">
                            Progress
                          </span>
                          <span className="text-xs font-medium text-foreground">
                            {Math.round(metric.progress)}%
                          </span>
                        </div>
                        <Progress value={metric.progress} className="h-2" />
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground">
                  These metrics are updated in real-time as the project
                  progresses. Check back regularly to see the latest progress on
                  funding, completion, and volunteer commitments.
                </p>
              </div>
            </div>
          </DrawerBodyComponent>
        </>
      )}
    </DrawerContent>
  );
}
