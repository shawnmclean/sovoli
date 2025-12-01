"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { Divider } from "@sovoli/ui/components/divider";
import {
  CheckCircle2,
  Package,
  Wrench,
  Users,
  DollarSign,
  Briefcase,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import type { Project } from "~/modules/projects/types";
import type { Need, NeedType } from "~/modules/needs/types";
import { useProjectCart } from "../../context/ProjectCartContext";

interface ProjectNeedsSectionProps {
  project: Project;
}

/** Configuration for each need type */
const NEED_TYPE_CONFIG: Record<
  NeedType,
  { label: string; pluralLabel: string; icon: typeof Package; color: string }
> = {
  material: {
    label: "Material",
    pluralLabel: "Materials",
    icon: Package,
    color: "text-primary",
  },
  service: {
    label: "Service",
    pluralLabel: "Services",
    icon: Wrench,
    color: "text-secondary",
  },
  human: {
    label: "Volunteer",
    pluralLabel: "Volunteers",
    icon: Users,
    color: "text-warning",
  },
  financial: {
    label: "Funding",
    pluralLabel: "Funding",
    icon: DollarSign,
    color: "text-success",
  },
  job: {
    label: "Job",
    pluralLabel: "Jobs",
    icon: Briefcase,
    color: "text-danger",
  },
};

/** Combined need item - merges same needs from different sources */
interface CombinedNeed {
  /** Use item ID for materials, or slug for others */
  key: string;
  title: string;
  description?: string;
  type: NeedType;
  totalQuantity: number;
  fulfilledQuantity: number;
  unit: string;
  unitPrice: number;
  isFulfilled: boolean;
  sources: { phaseTitle?: string; phaseIndex?: number; quantity: number }[];
}

/** Grouped needs structure */
interface NeedTypeGroup {
  type: NeedType;
  needs: CombinedNeed[];
  totalCount: number;
  fulfilledCount: number;
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

function getNeedKey(need: Need): string {
  // For materials, use the item ID to combine same items
  if (need.type === "material") {
    return `material-${need.item.id}`;
  }
  // For others, use slug (they're typically unique)
  return need.slug;
}

function getNeedQuantityAndUnit(need: Need): { quantity: number; unit: string } {
  if (need.type === "human") {
    return { quantity: need.headcount ?? need.quantity ?? 1, unit: "volunteer" };
  }
  if (need.type === "material") {
    return { quantity: need.quantity ?? 1, unit: need.item.unitLabel ?? "item" };
  }
  return { quantity: need.quantity ?? 1, unit: "item" };
}

function getNeedUnitPrice(need: Need): number {
  const { quantity } = getNeedQuantityAndUnit(need);
  if (need.procurement?.estimatedCost && quantity > 0) {
    return Math.round(need.procurement.estimatedCost / quantity);
  }
  if (need.type === "financial" && need.targetAmount) {
    return need.targetAmount.JMD ?? need.targetAmount.USD ?? 0;
  }
  return 0;
}

/** Collect and combine all needs from project and phases */
function collectAndCombineNeeds(project: Project): CombinedNeed[] {
  const needsMap = new Map<string, CombinedNeed>();

  const addNeed = (need: Need, phaseTitle?: string, phaseIndex?: number) => {
    const key = getNeedKey(need);
    const { quantity, unit } = getNeedQuantityAndUnit(need);
    const unitPrice = getNeedUnitPrice(need);
    const isFulfilled = need.status === "fulfilled";
    const fulfilledQty = need.fulfillment?.quantityMet ?? (isFulfilled ? quantity : 0);

    const existing = needsMap.get(key);
    if (existing) {
      // Combine with existing
      existing.totalQuantity += quantity;
      existing.fulfilledQuantity += fulfilledQty;
      existing.isFulfilled = existing.isFulfilled && isFulfilled;
      existing.sources.push({ phaseTitle, phaseIndex, quantity });
      // Use the higher unit price if different
      if (unitPrice > existing.unitPrice) {
        existing.unitPrice = unitPrice;
      }
    } else {
      // Create new combined need
      needsMap.set(key, {
        key,
        title: need.title,
        description: need.description,
        type: need.type,
        totalQuantity: quantity,
        fulfilledQuantity: fulfilledQty,
        unit,
        unitPrice,
        isFulfilled,
        sources: [{ phaseTitle, phaseIndex, quantity }],
      });
    }
  };

  // Add project-level needs
  if (project.needs) {
    for (const need of project.needs) {
      addNeed(need);
    }
  }

  // Add phase needs
  if (project.phases) {
    for (const [index, phase] of project.phases.entries()) {
      if (phase.needs) {
        for (const need of phase.needs) {
          addNeed(need, phase.title, index);
        }
      }
    }
  }

  return Array.from(needsMap.values());
}

/** Group combined needs by type */
function groupNeedsByType(combinedNeeds: CombinedNeed[]): NeedTypeGroup[] {
  const typeOrder: NeedType[] = ["material", "service", "human", "financial", "job"];

  const groupedByType: Partial<Record<NeedType, CombinedNeed[]>> = {};

  for (const n of combinedNeeds) {
    const typeArray = groupedByType[n.type] ?? [];
    typeArray.push(n);
    groupedByType[n.type] = typeArray;
  }

  return typeOrder
    .filter((type) => groupedByType[type] && groupedByType[type].length > 0)
    .map((type) => {
      const typeNeeds = groupedByType[type] ?? [];

      // Sort: active needs first, fulfilled at the bottom
      const sortedNeeds = [...typeNeeds].sort((a, b) => {
        const aFulfilled = a.isFulfilled ? 1 : 0;
        const bFulfilled = b.isFulfilled ? 1 : 0;
        return aFulfilled - bFulfilled;
      });

      return {
        type,
        needs: sortedNeeds,
        totalCount: typeNeeds.length,
        fulfilledCount: typeNeeds.filter((n) => n.isFulfilled).length,
      };
    });
}

function NeedItem({ need }: { need: CombinedNeed }) {
  const { getItemQuantity, setItemQuantity } = useProjectCart();

  const availableToFund = Math.max(0, need.totalQuantity - need.fulfilledQuantity);
  const isFullyFunded = need.isFulfilled || availableToFund === 0;
  const quantity = getItemQuantity(need.key);
  const totalCost = need.unitPrice * availableToFund;

  const createCartItem = (): { id: string; name: string; type: "material" | "labor"; unit: string; unitPrice: number; quantity: number } => ({
    id: need.key,
    name: need.title,
    type: need.type === "material" ? "material" : "labor",
    unit: need.unit,
    unitPrice: need.unitPrice,
    quantity: 0,
  });

  const handleIncrement = () => {
    if (quantity < availableToFund) {
      setItemQuantity(createCartItem(), quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setItemQuantity(createCartItem(), quantity - 1);
    }
  };

  const handleAll = () => {
    setItemQuantity(createCartItem(), availableToFund);
  };

  const handleStart = () => {
    setItemQuantity(createCartItem(), 1);
  };

  // Compact view for fully funded items
  if (isFullyFunded) {
    return (
      <div className="flex items-center gap-2 py-2 text-default-400">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        <span className="text-sm line-through">
          {need.title}
          {need.totalQuantity > 1 && ` ×${need.totalQuantity}`}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4 py-3">
      {/* Left: Multi-line info */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="font-medium">{need.title}</span>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-default-500">
            <span className="font-semibold text-foreground">{availableToFund}</span>
            {" "}of{" "}
            <span className="text-default-400">{need.totalQuantity}</span>
            {" "}{need.unit}{need.totalQuantity !== 1 ? "s" : ""} remaining
          </span>
          {totalCost > 0 && (
            <>
              <span className="text-default-300">•</span>
              <span className="font-semibold text-success">{formatCurrency(totalCost)}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="shrink-0">
        {quantity > 0 ? (
          <div className="flex flex-col items-end gap-2">
            <div className="font-semibold text-primary">
              Fund: {formatCurrency(quantity * need.unitPrice)}
            </div>
            <div className="flex items-center gap-2">
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
                <span className="min-w-[2rem] text-center text-sm font-medium">{quantity}</span>
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
            </div>
          </div>
        ) : (
          <Button color="primary" size="sm" onPress={handleStart}>
            Fund Item
          </Button>
        )}
      </div>
    </div>
  );
}

function NeedTypeGroupCard({ group }: { group: NeedTypeGroup }) {
  const config = NEED_TYPE_CONFIG[group.type];
  const Icon = config.icon;

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-default-100 ${config.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <h4 className="font-semibold">{config.pluralLabel}</h4>
          </div>
          <span className="text-xs text-default-500">
            {group.fulfilledCount}/{group.totalCount} funded
          </span>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="divide-y divide-default-100">
          {group.needs.map((need) => (
            <NeedItem key={need.key} need={need} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export function ProjectNeedsSection({ project }: ProjectNeedsSectionProps) {
  const combinedNeeds = collectAndCombineNeeds(project);

  if (combinedNeeds.length === 0) {
    return null;
  }

  const groups = groupNeedsByType(combinedNeeds);
  const totalNeeds = combinedNeeds.length;
  const fulfilledCount = combinedNeeds.filter((n) => n.isFulfilled).length;

  return (
    <>
      <Divider className="my-6 sm:my-8" />
      <section className="mb-6 sm:mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight">What&apos;s Needed</h2>
          <span className="text-sm text-muted-foreground">
            {fulfilledCount}/{totalNeeds} funded
          </span>
        </div>

        <div className="space-y-4">
          {groups.map((group) => (
            <NeedTypeGroupCard key={group.type} group={group} />
          ))}
        </div>
      </section>
    </>
  );
}
