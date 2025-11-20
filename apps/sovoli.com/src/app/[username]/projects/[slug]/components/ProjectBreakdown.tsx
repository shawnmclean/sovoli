"use client";

import { Card } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Button } from "@sovoli/ui/components/button";
import { Progress } from "@sovoli/ui/components/progress";
import { Divider } from "@sovoli/ui/components/divider";
import { CheckCircle2, Circle, Minus, Plus, Trash2 } from "lucide-react";
import type { Project } from "~/modules/projects/types";
import type { Need } from "~/modules/needs/types";
import type { Item } from "~/modules/core/items/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { useProjectCart } from "../context/ProjectCartContext";
import { pluralize } from "~/utils/pluralize";

interface ProjectBreakdownProps {
  project: Project;
  orgInstance: OrgInstance;
}

interface BreakdownItem {
  id: string;
  name: string;
  type: "material" | "labor";
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  status: "open" | "funded" | "partial";
  fulfilled: number;
  contributors: number;
  supplier?: string;
}

interface ProjectPhase {
  id: string;
  name: string;
  totalCost: number;
  funded: number;
  items: BreakdownItem[];
}

// Get cost for a need based on slug
function getNeedCost(slug: string): number {
  if (slug === "sandybankinfant-industrial-sheeting-2025") {
    return 2000000; // 2M JMD
  }
  if (slug === "sandybankinfant-exterior-door-2025") {
    return 20000; // 20k JMD
  }
  return 0;
}

// Calculate unit price and breakdown from total cost and quantity
function calculateItemBreakdown(
  need: Need & { type: "material"; item: Item },
  totalCost: number,
): BreakdownItem {
  const quantity = need.quantity ?? 1;
  const unitPrice = Math.round(totalCost / quantity);

  // For demo purposes, simulate some funding status
  // In real app, this would come from actual funding data
  const isFunded = need.status === "fulfilled";
  // Use a deterministic number based on need slug for demo purposes
  const contributors = isFunded
    ? need.slug.includes("industrial")
      ? 4
      : 1
    : 0;

  // Infer unit
  let unit = "unit";
  if (need.slug === "sandybankinfant-industrial-sheeting-2025") {
    unit = "square";
  }

  // Override for demo purposes to match 66% funded logic
  // but keep the original unit (squares) if possible, or adjust math
  // Actually, user said "put back the original units, the squares coming from the needs file is real"
  // So we assume quantity is correct from need.

  return {
    id: need.slug,
    name: need.title,
    type: "material",
    quantity,
    unit,
    unitPrice,
    total: totalCost,
    status: isFunded ? "funded" : "open",
    fulfilled: isFunded ? quantity : 0,
    contributors,
    supplier: "Phils Hardware",
  };
}

function buildProjectPhases(project: Project): ProjectPhase[] {
  const needs = project.needs ?? [];

  // Filter to only material needs with items
  const materialNeeds = needs.filter(
    (need): need is Need & { type: "material"; item: Item } => {
      return need.type === "material" && "item" in need;
    },
  );

  if (materialNeeds.length === 0) {
    return [];
  }

  const phases: ProjectPhase[] = [];

  // Phase 1: Roofing & Structural
  const roofingNeed = materialNeeds.find(
    (need) => need.slug === "sandybankinfant-industrial-sheeting-2025",
  );

  if (roofingNeed) {
    const totalCost = getNeedCost(roofingNeed.slug);
    const funded =
      roofingNeed.status === "fulfilled"
        ? totalCost
        : Math.round(totalCost * 0.66);

    const roofingItem = calculateItemBreakdown(roofingNeed, totalCost);

    // Adjust fulfilled amount for roofing item if it's partial
    if (funded > 0 && funded < totalCost) {
      roofingItem.status = "partial";
      roofingItem.fulfilled = Math.round(
        (funded / totalCost) * roofingItem.quantity,
      );
    }

    phases.push({
      id: "phase-1",
      name: "Phase 1: Roofing & Structural",
      totalCost,
      funded,
      items: [
        roofingItem,
        // Add labor item for roofing
        {
          id: "l1",
          name: "Roofing Installation Labor",
          type: "labor",
          quantity: 3,
          unit: "day",
          unitPrice: 15000,
          total: 45000,
          status: "open",
          fulfilled: 0,
          contributors: 0,
          supplier: "Local Contractors",
        },
      ],
    });
  }

  // Phase 2: Security & Access
  const doorNeed = materialNeeds.find(
    (need) => need.slug === "sandybankinfant-exterior-door-2025",
  );

  if (doorNeed) {
    const totalCost = getNeedCost(doorNeed.slug);
    const funded = doorNeed.status === "fulfilled" ? totalCost : 0;

    phases.push({
      id: "phase-2",
      name: "Phase 2: Security & Access",
      totalCost,
      funded,
      items: [
        calculateItemBreakdown(doorNeed, totalCost),
        // Add labor item for door installation
        {
          id: "l2",
          name: "Door Installation Labor",
          type: "labor",
          quantity: 4,
          unit: "hour",
          unitPrice: 2000,
          total: 8000,
          status: "open",
          fulfilled: 0,
          contributors: 0,
          supplier: "Local Contractors",
        },
      ],
    });
  }

  return phases;
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

function BreakdownItemComponent({ item }: { item: BreakdownItem }) {
  const { getItemQuantity, setItemQuantity } = useProjectCart();
  const quantity = getItemQuantity(item.id);
  const remaining = Math.max(0, item.quantity - item.fulfilled - quantity);

  const availableToFund = item.quantity - item.fulfilled;

  const handleIncrement = () => {
    if (quantity < availableToFund) {
      setItemQuantity(
        {
          id: item.id,
          name: item.name,
          type: item.type,
          unit: item.unit,
          unitPrice: item.unitPrice,
          quantity: 0, // Will be overwritten
        },
        quantity + 1,
      );
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setItemQuantity(
        {
          id: item.id,
          name: item.name,
          type: item.type,
          unit: item.unit,
          unitPrice: item.unitPrice,
          quantity: 0, // Will be overwritten
        },
        quantity - 1,
      );
    }
  };

  const handleAll = () => {
    const availableToFund = item.quantity - item.fulfilled;
    setItemQuantity(
      {
        id: item.id,
        name: item.name,
        type: item.type,
        unit: item.unit,
        unitPrice: item.unitPrice,
        quantity: 0, // Will be overwritten
      },
      availableToFund,
    );
  };

  const handleStart = () => {
    setItemQuantity(
      {
        id: item.id,
        name: item.name,
        type: item.type,
        unit: item.unit,
        unitPrice: item.unitPrice,
        quantity: 0, // Will be overwritten
      },
      1,
    );
  };

  const isFullyFunded =
    item.status === "funded" || item.quantity - item.fulfilled === 0;

  return (
    <div className="p-4 hover:bg-default-100/50 transition-colors">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              {item.status === "funded" ? (
                <CheckCircle2 className="h-5 w-5 text-success-500" />
              ) : (
                <Circle className="h-5 w-5 text-default-400" />
              )}
              <h4 className="font-medium text-base">{item.name}</h4>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-small text-default-500 pl-7">
              <span>{item.supplier ?? "Supplier"}</span>
              <span className="hidden sm:inline">•</span>
              <Chip size="sm" variant="flat" className="text-[10px] h-5 px-1.5">
                {item.type === "material" ? "Material" : "Labor"}
              </Chip>
            </div>
          </div>

          <div className="text-right pl-7 sm:pl-0 w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:items-end">
            <div className="sm:text-right">
              <span className="block font-semibold text-large">
                {formatCurrency(item.unitPrice)}
                <span className="text-tiny text-default-400 font-normal ml-1">
                  per {item.unit}
                </span>
              </span>
            </div>
            {item.contributors > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {item.contributors} contributor
                {item.contributors !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>

        {!isFullyFunded && (
          <>
            <Divider className="my-1" />

            <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
              <div className="w-full sm:flex-1">
                <div className="text-small flex justify-between sm:justify-start sm:gap-4 mb-1">
                  <span className="font-medium">
                    {remaining} {pluralize(remaining, item.unit)} remaining
                  </span>
                </div>
                {item.status !== "funded" && (
                  <div className="w-full sm:max-w-[200px]">
                    <Progress
                      size="sm"
                      value={Math.round(
                        ((item.fulfilled + quantity) / item.quantity) * 100,
                      )}
                      color="success"
                      aria-label="Funding progress"
                    />
                    <div className="flex justify-between text-[10px] text-default-400 mt-1">
                      <span>{item.fulfilled + quantity} funded</span>
                      <span>{item.quantity} total</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-auto flex flex-col items-end gap-3">
                {quantity > 0 ? (
                  <div className="flex flex-col items-end w-full">
                    <div className="font-semibold text-primary mb-2 text-lg">
                      Fund: {formatCurrency(quantity * item.unitPrice)}
                    </div>
                    <div className="flex items-center gap-2 w-full justify-end">
                      <div className="flex items-center gap-1 bg-default-100 rounded-md p-1">
                        <Button
                          variant="light"
                          isIconOnly
                          className="h-8 w-8 min-w-8"
                          onPress={handleDecrement}
                          aria-label="Decrease quantity"
                        >
                          {quantity === 1 ? (
                            <Trash2 className="h-4 w-4 text-danger" />
                          ) : (
                            <Minus className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="min-w-[2rem] text-center text-medium font-medium">
                          {quantity}
                        </span>
                        <Button
                          variant="light"
                          isIconOnly
                          className="h-8 w-8 min-w-8"
                          onPress={handleIncrement}
                          isDisabled={quantity >= availableToFund}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="bordered"
                        size="sm"
                        className="h-10 min-w-[60px]"
                        onPress={handleAll}
                        isDisabled={quantity >= availableToFund}
                      >
                        All
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    color="primary"
                    onPress={handleStart}
                    className="sm:w-auto sm:min-w-[120px]"
                  >
                    Fund Item
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {isFullyFunded && (
          <div className="flex justify-end">
            <Chip color="success" variant="flat">
              Fully Funded
            </Chip>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectBreakdown({ project }: ProjectBreakdownProps) {
  const projectPhases = buildProjectPhases(project);

  if (projectPhases.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8 mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Project Breakdown
          </h2>
          <p className="text-muted-foreground">
            Detailed costs for materials and labor by phase
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success-500/20 border border-success-500" />
            <span>Funded</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-default-400" />
            <span>Open</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {projectPhases.map((phase) => {
          const percentFunded = Math.round(
            (phase.funded / phase.totalCost) * 100,
          );

          return (
            <Card key={phase.id} className="overflow-hidden border-muted">
              <div className="bg-default-100/50 p-4 border-b border-default-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{phase.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {formatCurrency(phase.funded)} raised of{" "}
                      {formatCurrency(phase.totalCost)}
                    </span>
                    <span>•</span>
                    <span>{percentFunded}% Funded</span>
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Progress value={percentFunded} className="h-2" />
                </div>
              </div>

              <div className="divide-y divide-default-200">
                {phase.items.map((item) => (
                  <BreakdownItemComponent key={item.id} item={item} />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
