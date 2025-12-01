"use client";

import { useEffect } from "react";
import {
  DrawerContent,
  DrawerHeader as DrawerHeaderComponent,
  DrawerBody as DrawerBodyComponent,
} from "@sovoli/ui/components/drawer";
import { Card } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Progress } from "@sovoli/ui/components/progress";
import { Alert } from "@sovoli/ui/components/alert";
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Package,
  ImageIcon,
} from "lucide-react";
import type { Project, ProjectStatus } from "~/modules/projects/types";
import type { Need } from "~/modules/needs/types";
import { trackProjectAnalytics } from "../../lib/projectAnalytics";

interface ProjectPhaseDetailsProps {
  project: Project;
  phaseSlug: string;
}

const STATUS_CONFIG: Record<
  ProjectStatus,
  {
    label: string;
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    Icon: typeof Circle;
  }
> = {
  planned: { label: "Planned", color: "default", Icon: Circle },
  active: { label: "In Progress", color: "primary", Icon: Clock },
  completed: { label: "Completed", color: "success", Icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "danger", Icon: Circle },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function NeedCard({ need }: { need: Need }) {
  const isFulfilled = need.status === "fulfilled";
  const isInProgress = need.status === "in-progress";

  return (
    <Card className="p-3 border-none bg-content1/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isFulfilled ? (
              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            ) : isInProgress ? (
              <Clock className="h-4 w-4 text-primary shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-default-400 shrink-0" />
            )}
            <span
              className={`text-sm font-medium ${isFulfilled ? "text-default-400 line-through" : ""}`}
            >
              {need.title}
            </span>
          </div>

          {need.description && (
            <p className="text-xs text-default-500 ml-6 line-clamp-2">
              {need.description}
            </p>
          )}

          {isInProgress && (
            <Chip size="sm" color="primary" variant="flat" className="mt-2 ml-6">
              In Progress
            </Chip>
          )}
        </div>

        {!isFulfilled && (
          <button
            type="button"
            className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Help
          </button>
        )}
      </div>
    </Card>
  );
}

export function ProjectPhaseDetails({
  project,
  phaseSlug,
}: ProjectPhaseDetailsProps) {
  const phase = project.phases?.find((p) => p.slug === phaseSlug);

  useEffect(() => {
    if (phase) {
      trackProjectAnalytics("SectionOpened", project, {
        section: "phase",
        phaseSlug,
        phaseTitle: phase.title,
      });
    }
  }, [project, phaseSlug, phase]);

  if (!phase) {
    return (
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeaderComponent
              showBackButton
              onBackPress={onClose}
              title="Phase Not Found"
            />
            <DrawerBodyComponent>
              <Alert color="danger" variant="flat">
                <p className="text-sm font-medium">Phase not found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The requested phase could not be found in this project.
                </p>
              </Alert>
            </DrawerBodyComponent>
          </>
        )}
      </DrawerContent>
    );
  }

  const status = phase.status ?? "planned";
  const statusConfig = STATUS_CONFIG[status];
  const StatusIcon = statusConfig.Icon;

  const phaseIndex = project.phases?.findIndex((p) => p.slug === phaseSlug) ?? 0;
  const needs = phase.needs ?? [];
  const completedNeeds = needs.filter((n) => n.status === "fulfilled").length;
  const progress = needs.length > 0 ? Math.round((completedNeeds / needs.length) * 100) : 0;
  const hasMedia = phase.media && phase.media.length > 0;

  return (
    <DrawerContent>
      {(onClose) => (
        <>
          <DrawerHeaderComponent
            showBackButton
            onBackPress={onClose}
            title={`Phase ${phaseIndex + 1}`}
          />
          <DrawerBodyComponent>
            <div className="space-y-6 pb-20">
              {/* Phase Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold">{phase.title}</h2>
                  <Chip
                    startContent={<StatusIcon className="w-3 h-3" />}
                    variant="flat"
                    color={statusConfig.color}
                    size="sm"
                  >
                    {statusConfig.label}
                  </Chip>
                </div>

                {phase.description && (
                  <p className="text-sm text-default-600">{phase.description}</p>
                )}
              </div>

              {/* Progress Section */}
              {needs.length > 0 && (
                <Card className="p-4 border-none bg-content1/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-semibold text-primary tabular-nums">
                      {progress}%
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    size="md"
                    color={status === "completed" ? "success" : "primary"}
                    className="w-full"
                    aria-label="Phase progress"
                  />
                  <p className="text-xs text-default-500 mt-2">
                    {completedNeeds} of {needs.length} needs fulfilled
                  </p>
                </Card>
              )}

              {/* Timeline */}
              {(phase.startDate ?? phase.endDate) && (
                <Card className="p-4 border-none bg-content1/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-default-500" />
                    <span className="text-sm font-medium">Timeline</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {phase.startDate && (
                      <div>
                        <p className="text-xs text-default-500 mb-1">Start Date</p>
                        <p className="text-sm font-medium">{formatDate(phase.startDate)}</p>
                      </div>
                    )}
                    {phase.endDate && (
                      <div>
                        <p className="text-xs text-default-500 mb-1">End Date</p>
                        <p className="text-sm font-medium">{formatDate(phase.endDate)}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Media Preview */}
              {hasMedia && (
                <Card className="p-4 border-none bg-content1/50">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="h-4 w-4 text-default-500" />
                    <span className="text-sm font-medium">Media</span>
                    <span className="text-xs text-default-500">
                      ({phase.media?.length} items)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {phase.media?.slice(0, 6).map((media, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg bg-default-100 overflow-hidden"
                      >
                        {media.type === "image" && media.url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={media.url}
                            alt={media.title ?? `Phase media ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Needs Section */}
              {needs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-default-500" />
                    <span className="text-sm font-medium">Needs</span>
                    <span className="text-xs text-default-500">
                      ({needs.length} items)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {needs.map((need) => (
                      <NeedCard key={need.slug} need={need} />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {needs.length === 0 && !hasMedia && !phase.description && (
                <Alert color="default" variant="flat">
                  <p className="text-sm">No additional details available for this phase.</p>
                </Alert>
              )}
            </div>
          </DrawerBodyComponent>
        </>
      )}
    </DrawerContent>
  );
}

