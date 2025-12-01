"use client";

import { useEffect } from "react";
import {
  DrawerContent,
  DrawerHeader as DrawerHeaderComponent,
  DrawerBody as DrawerBodyComponent,
} from "@sovoli/ui/components/drawer";
import { Button } from "@sovoli/ui/components/button";
import { Card } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Divider } from "@sovoli/ui/components/divider";
import { Progress } from "@sovoli/ui/components/progress";
import { Alert } from "@sovoli/ui/components/alert";
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Package,
  ImageIcon,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import type { Project, ProjectStatus } from "~/modules/projects/types";
import type { Need } from "~/modules/needs/types";
import { trackProjectAnalytics } from "../../lib/projectAnalytics";
import { useProjectCart } from "../../context/ProjectCartContext";
import { pluralize } from "~/utils/pluralize";

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

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M JMD`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}k JMD`;
  }
  return `$${amount.toLocaleString()} JMD`;
}

function getNeedQuantityAndUnit(need: Need): { totalQuantity: number; unit: string } {
  if (need.type === "human") {
    return { totalQuantity: need.headcount ?? need.quantity ?? 1, unit: "volunteer" };
  }
  if (need.type === "material") {
    return { totalQuantity: need.quantity ?? 1, unit: need.item.unitLabel ?? "item" };
  }
  return { totalQuantity: need.quantity ?? 1, unit: "item" };
}

function getNeedUnitPrice(need: Need, totalQuantity: number): number {
  // First check procurement cost
  if (need.procurement?.estimatedCost) {
    return Math.round(need.procurement.estimatedCost / totalQuantity);
  }
  // For financial needs, use target amount
  if (need.type === "financial" && need.targetAmount) {
    return need.targetAmount.JMD ?? need.targetAmount.USD ?? 0;
  }
  return 0;
}

function NeedCard({ need }: { need: Need }) {
  const { getItemQuantity, setItemQuantity } = useProjectCart();
  
  const isFulfilled = need.status === "fulfilled";
  const isInProgress = need.status === "in-progress";
  
  // Get need details for funding
  const needId = need.slug;
  const { totalQuantity, unit } = getNeedQuantityAndUnit(need);
  const fulfilledQuantity = need.fulfillment?.quantityMet ?? (isFulfilled ? totalQuantity : 0);
  const unitPrice = getNeedUnitPrice(need, totalQuantity);
  
  const quantity = getItemQuantity(needId);
  const availableToFund = Math.max(0, totalQuantity - fulfilledQuantity);
  const remaining = Math.max(0, availableToFund - quantity);
  const isFullyFunded = isFulfilled || availableToFund === 0;

  const handleIncrement = () => {
    if (quantity < availableToFund) {
      setItemQuantity(
        {
          id: needId,
          name: need.title,
          type: need.type === "material" ? "material" : "labor",
          unit,
          unitPrice,
          quantity: 0,
        },
        quantity + 1,
      );
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setItemQuantity(
        {
          id: needId,
          name: need.title,
          type: need.type === "material" ? "material" : "labor",
          unit,
          unitPrice,
          quantity: 0,
        },
        quantity - 1,
      );
    }
  };

  const handleAll = () => {
    setItemQuantity(
      {
        id: needId,
        name: need.title,
        type: need.type === "material" ? "material" : "labor",
        unit,
        unitPrice,
        quantity: 0,
      },
      availableToFund,
    );
  };

  const handleStart = () => {
    setItemQuantity(
      {
        id: needId,
        name: need.title,
        type: need.type === "material" ? "material" : "labor",
        unit,
        unitPrice,
        quantity: 0,
      },
      1,
    );
  };

  return (
    <Card className="p-4 border-none bg-content1/50">
      <div className="space-y-3">
        {/* Header */}
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
          </div>

          {unitPrice > 0 && (
            <div className="text-right shrink-0">
              <span className="font-semibold text-sm">
                {formatCurrency(unitPrice)}
              </span>
              <span className="text-xs text-default-400 block">
                per {unit}
              </span>
            </div>
          )}
        </div>

        {/* Funding Controls */}
        {!isFullyFunded && (
          <>
            <Divider />
            
            <div className="flex flex-col gap-3">
              {/* Progress */}
              <div>
                <div className="text-xs flex justify-between mb-1">
                  <span className="font-medium">
                    {remaining} {pluralize(remaining, unit)} remaining
                  </span>
                </div>
                <Progress
                  size="sm"
                  value={Math.round(((fulfilledQuantity + quantity) / totalQuantity) * 100)}
                  color="success"
                  aria-label="Funding progress"
                />
                <div className="flex justify-between text-[10px] text-default-400 mt-1">
                  <span>{fulfilledQuantity + quantity} funded</span>
                  <span>{totalQuantity} total</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                {quantity > 0 ? (
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex items-center gap-1 bg-default-100 rounded-md p-1">
                      <Button
                        variant="light"
                        isIconOnly
                        size="sm"
                        className="h-7 w-7 min-w-7"
                        onPress={handleDecrement}
                        aria-label="Decrease quantity"
                      >
                        {quantity === 1 ? (
                          <Trash2 className="h-3.5 w-3.5 text-danger" />
                        ) : (
                          <Minus className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <span className="min-w-[1.5rem] text-center text-sm font-medium">
                        {quantity}
                      </span>
                      <Button
                        variant="light"
                        isIconOnly
                        size="sm"
                        className="h-7 w-7 min-w-7"
                        onPress={handleIncrement}
                        isDisabled={quantity >= availableToFund}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <Button
                      variant="bordered"
                      size="sm"
                      className="h-8"
                      onPress={handleAll}
                      isDisabled={quantity >= availableToFund}
                    >
                      All
                    </Button>

                    {unitPrice > 0 && (
                      <span className="ml-auto font-semibold text-primary text-sm">
                        {formatCurrency(quantity * unitPrice)}
                      </span>
                    )}
                  </div>
                ) : (
                  <Button
                    color="primary"
                    size="sm"
                    onPress={handleStart}
                    className="w-full"
                  >
                    Fund This Need
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Fulfilled Badge */}
        {isFullyFunded && (
          <div className="flex justify-end">
            <Chip color="success" variant="flat" size="sm">
              Fully Funded
            </Chip>
          </div>
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
                            alt={media.alt ?? `Phase media ${index + 1}`}
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

