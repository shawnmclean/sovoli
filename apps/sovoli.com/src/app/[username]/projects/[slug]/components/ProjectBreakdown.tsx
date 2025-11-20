import { Card } from "@sovoli/ui/components/card";
import { Badge } from "@sovoli/ui/components/badge";
import { Button } from "@sovoli/ui/components/button";
import { Progress } from "@sovoli/ui/components/progress";
import { CheckCircle2, Circle, Hammer, Package } from "lucide-react";
import type { Project } from "~/modules/projects/types";
import type { Need } from "~/modules/needs/types";
import type { Item } from "~/modules/core/items/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { config } from "~/utils/config";

interface ProjectBreakdownProps {
  project: Project;
  orgInstance: OrgInstance;
}

interface BreakdownItem {
  id: string;
  name: string;
  type: "material" | "labor";
  quantity: string;
  unitPrice: number;
  total: number;
  status: "open" | "funded";
  contributors: number;
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

  // Format quantity string
  let quantityStr = `${quantity}`;
  if (need.slug === "sandybankinfant-industrial-sheeting-2025") {
    quantityStr = `${quantity} squares`;
  } else if (need.slug === "sandybankinfant-exterior-door-2025") {
    quantityStr = `${quantity} unit${quantity !== 1 ? "s" : ""}`;
  }

  return {
    id: need.slug,
    name: need.title,
    type: "material",
    quantity: quantityStr,
    unitPrice,
    total: totalCost,
    status: isFunded ? "funded" : "open",
    contributors,
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

    phases.push({
      id: "phase-1",
      name: "Phase 1: Roofing & Structural",
      totalCost,
      funded,
      items: [
        calculateItemBreakdown(roofingNeed, totalCost),
        // Add labor item for roofing
        {
          id: "l1",
          name: "Roofing Installation Labor",
          type: "labor",
          quantity: "3 days",
          unitPrice: 15000,
          total: 45000,
          status: "open",
          contributors: 0,
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
          quantity: "4 hours",
          unitPrice: 2000,
          total: 8000,
          status: "open",
          contributors: 0,
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

export function ProjectBreakdown({
  project,
  orgInstance,
}: ProjectBreakdownProps) {
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
            <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary" />
            <span>Funded</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-muted-foreground" />
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
              <div className="bg-muted/30 p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
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

              <div className="divide-y">
                {phase.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {item.status === "funded" ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={`font-medium ${
                                item.status === "funded"
                                  ? "text-muted-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {item.name}
                            </h4>
                            <Badge
                              variant="flat"
                              className="text-[10px] h-5 px-1.5 gap-1 font-normal"
                            >
                              {item.type === "material" ? (
                                <Package className="h-3 w-3" />
                              ) : (
                                <Hammer className="h-3 w-3" />
                              )}
                              {item.type === "material" ? "Material" : "Labor"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 md:w-auto w-full pl-8 md:pl-0">
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrency(item.total)}
                          </div>
                          {item.contributors > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {item.contributors} contributor
                              {item.contributors !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                        {item.status === "open" ? (
                          <Button
                            as={WhatsAppLink}
                            phoneNumber={config.contact.whatsapp}
                            message={`Hi Sovoli team, I'd like to fund ${item.name} (${item.quantity}) for ${project.title} at ${orgInstance.org.name}. Total cost: ${formatCurrency(item.total)}.`}
                            size="sm"
                            className="h-8"
                            event="Contact"
                            eventProperties={{
                              source: "project-breakdown",
                              project_id: project.id,
                              org_username: orgInstance.org.username,
                              item_id: item.id,
                              item_name: item.name,
                              item_type: item.type,
                              cta_type: "fund_item",
                            }}
                          >
                            Fund Item
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-muted-foreground"
                            disabled
                          >
                            Funded
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
