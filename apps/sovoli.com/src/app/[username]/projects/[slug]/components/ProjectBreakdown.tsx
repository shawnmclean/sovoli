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
import { ORGS } from "~/modules/data/organisations";

interface ProjectBreakdownProps {
  project: Project;
  orgInstance: OrgInstance;
}

interface Supplier {
  name: string;
  price: number;
  org: OrgInstance;
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

// Function to get supplier data for an item from recommended suppliers
function getSupplierDataForItem(
  itemId: string,
  recommendedSuppliers: OrgInstance[],
): Supplier[] {
  const suppliers: Supplier[] = [];

  recommendedSuppliers.forEach((supplierOrg) => {
    // Check if this supplier has a catalog module
    if (supplierOrg.catalogModule?.items) {
      // Find the item in the supplier's catalog
      const catalogItem = supplierOrg.catalogModule.items.find(
        (catalogItem) => catalogItem.id === itemId,
      );

      if (catalogItem) {
        // Use JMD pricing if available, otherwise GYD, then USD
        const price =
          catalogItem.price.JMD ??
          catalogItem.price.GYD ??
          catalogItem.price.USD ??
          0;

        suppliers.push({
          name: supplierOrg.org.name,
          price: price,
          org: supplierOrg,
        });
      }
    }
  });

  // Sort by price (lowest first)
  return suppliers.sort((a, b) => a.price - b.price);
}

// Get the best price for a need from available suppliers
function getNeedCost(
  need: Need & { type: "material"; item: Item },
  recommendedSuppliers: OrgInstance[],
): { cost: number; supplier?: Supplier } {
  // First check if need has procurement cost data
  if (need.procurement?.estimatedCost) {
    return { cost: need.procurement.estimatedCost };
  }

  // Get suppliers for this item
  const suppliers = getSupplierDataForItem(need.item.id, recommendedSuppliers);
  const quantity = need.quantity ?? 1;

  if (suppliers.length > 0) {
    // Use the cheapest supplier
    const bestSupplier = suppliers[0];
    if (bestSupplier) {
      return {
        cost: bestSupplier.price * quantity,
        supplier: bestSupplier,
      };
    }
  }

  // Fallback: no supplier data available
  return { cost: 0 };
}

// Calculate unit price and breakdown from total cost and quantity
function calculateItemBreakdown(
  need: Need & { type: "material"; item: Item },
  costData: { cost: number; supplier?: Supplier },
): BreakdownItem {
  const quantity = need.quantity ?? 1;
  const totalCost = costData.cost;
  const unitPrice = quantity > 0 ? Math.round(totalCost / quantity) : 0;

  // Use actual need status for funding information
  const isFunded = need.status === "fulfilled";
  const isPartiallyFunded =
    need.status === "in-progress" || need.procurement?.status === "ordered";

  // Simulate contributors based on funding status and cost
  let contributors = 0;
  if (isFunded) {
    contributors = totalCost > 50000 ? Math.floor(totalCost / 50000) : 1;
  } else if (isPartiallyFunded) {
    contributors = Math.floor(totalCost / 100000) || 1;
  }

  // Use the item's unit label or infer from item type
  const unit = need.item.unitLabel ?? "unit";

  // Use supplier from cost data or fallback
  const supplierName = costData.supplier?.name ?? "No supplier available";

  return {
    id: need.slug,
    name: need.title,
    type: "material",
    quantity,
    unit,
    unitPrice,
    total: totalCost,
    status: isFunded ? "funded" : isPartiallyFunded ? "partial" : "open",
    fulfilled: isFunded
      ? quantity
      : isPartiallyFunded
        ? Math.floor(quantity * 0.3)
        : 0,
    contributors,
    supplier: supplierName,
  };
}

function buildProjectItems(
  project: Project,
  orgInstance: OrgInstance,
): BreakdownItem[] {
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

  // Get recommended suppliers from the organization
  const recommendedSuppliers =
    orgInstance.org.supplierRecommendations
      ?.map((rec) => {
        // Find the full OrgInstance for each supplier
        const fullSupplierOrg = ORGS.find(
          (org) => org.org.username === rec.org.username,
        );
        return fullSupplierOrg;
      })
      .filter((org): org is OrgInstance => org !== undefined) ?? [];

  const items: BreakdownItem[] = [];

  // Process each need and convert to breakdown item
  materialNeeds.forEach((need) => {
    const costData = getNeedCost(need, recommendedSuppliers);
    const item = calculateItemBreakdown(need, costData);
    items.push(item);
  });

  // Sort items by total cost (highest first) for better visibility
  return items.sort((a, b) => b.total - a.total);
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

export function ProjectBreakdown({
  project,
  orgInstance,
}: ProjectBreakdownProps) {
  const projectItems = buildProjectItems(project, orgInstance);

  if (projectItems.length === 0) {
    return (
      <div className="space-y-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Project Items Needed
            </h2>
            <p className="text-muted-foreground">
              No material needs found for this project
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalCost = projectItems.reduce((sum, item) => sum + item.total, 0);
  const totalFunded = projectItems.reduce((sum, item) => {
    if (item.status === "funded") {
      return sum + item.total;
    } else if (item.status === "partial") {
      return sum + item.fulfilled * item.unitPrice;
    }
    return sum;
  }, 0);
  const percentFunded =
    totalCost > 0 ? Math.round((totalFunded / totalCost) * 100) : 0;

  return (
    <div className="space-y-8 mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Project Items Needed
          </h2>
          <p className="text-muted-foreground">
            All materials and supplies required for this project
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success-500/20 border border-success-500" />
            <span>Funded</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning-500/20 border border-warning-500" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-default-400" />
            <span>Open</span>
          </div>
        </div>
      </div>

      {/* Project Summary */}
      <Card className="overflow-hidden border-muted">
        <div className="bg-default-100/50 p-4 border-b border-default-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Project Summary</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {formatCurrency(totalFunded)} raised of{" "}
                {formatCurrency(totalCost)}
              </span>
              <span>•</span>
              <span>{percentFunded}% Funded</span>
              <span>•</span>
              <span>{projectItems.length} items needed</span>
            </div>
          </div>
          <div className="w-full md:w-48">
            <Progress value={percentFunded} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Items List */}
      <Card className="overflow-hidden border-muted">
        <div className="bg-default-100/50 p-4 border-b border-default-200">
          <h3 className="font-semibold text-lg">Items Breakdown</h3>
          <p className="text-sm text-muted-foreground">
            {projectItems.some((item) => item.total > 0)
              ? "Sorted by cost (highest first)"
              : "Prices will be shown when suppliers are available"}
          </p>
        </div>

        <div className="divide-y divide-default-200">
          {projectItems.map((item) => (
            <BreakdownItemComponent key={item.id} item={item} />
          ))}
        </div>
      </Card>

      {/* Supplier Information */}
      {orgInstance.org.supplierRecommendations &&
      orgInstance.org.supplierRecommendations.length > 0 ? (
        <div className="text-sm text-muted-foreground">
          <p>
            Prices shown are from recommended suppliers:{" "}
            {orgInstance.org.supplierRecommendations
              .map((rec) => rec.org.name)
              .join(", ")}
          </p>
        </div>
      ) : (
        <div className="text-sm text-warning-600 bg-warning-50 p-3 rounded-lg border border-warning-200">
          <p>
            <strong>No suppliers configured.</strong> Contact the organization
            to set up supplier recommendations for pricing information.
          </p>
        </div>
      )}
    </div>
  );
}
