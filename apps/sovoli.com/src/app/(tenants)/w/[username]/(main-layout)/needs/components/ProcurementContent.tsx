"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";
import type { ProcurementNeed } from "~/modules/procurement/types";

interface ProcurementContentProps {
  orgInstance: OrgInstanceWithWebsite;
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTimeline(need: ProcurementNeed) {
  const timeline = need.neededBy;
  if (!timeline) return null;

  if (timeline.type === "deadline") {
    const formatted = formatDate(timeline.date);
    return formatted ? `Needed by ${formatted}` : `Needed by ${timeline.date}`;
  }

  const requestedAt = timeline.requestedAt
    ? formatDate(timeline.requestedAt)
    : null;
  const reason = timeline.reason ? ` — ${timeline.reason}` : "";

  if (requestedAt) {
    return `ASAP (requested ${requestedAt}${reason})`;
  }

  return `ASAP${reason}`;
}

function formatStatus(status?: ProcurementNeed["status"]) {
  if (!status) return null;
  return status
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatPriority(priority?: ProcurementNeed["priority"]) {
  switch (priority) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return null;
  }
}

function getPriorityColor(priority?: ProcurementNeed["priority"]) {
  switch (priority) {
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
      return "default";
    default:
      return "default";
  }
}

function getStatusColor(status?: ProcurementNeed["status"]) {
  switch (status) {
    case "approved":
    case "fulfilled":
      return "success";
    case "ordered":
      return "primary";
    case "awaiting-approval":
      return "warning";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
}

export function ProcurementContent({ orgInstance }: ProcurementContentProps) {
  const procurementModule = orgInstance.procurementModule;
  const needs = procurementModule?.needs ?? [];
  const [expandedNeedId, setExpandedNeedId] = useState<string | null>(null);

  if (needs.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              Procurement Needs
            </h1>
            <p className="text-muted-foreground">
              There are no procurement requests listed for{" "}
              {orgInstance.websiteModule.website.siteName} at this time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const locationMap = new Map(
    orgInstance.org.locations.map((location) => [location.key, location]),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-3 py-6 space-y-6 sm:px-4 sm:py-8 sm:space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Procurement Needs
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Active procurement requests for{" "}
            {orgInstance.websiteModule.website.siteName}.
          </p>
        </header>

        <div className="overflow-hidden rounded-xl border border-divider bg-card">
          <div className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,120px)] gap-4 border-b border-divider bg-default-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
            <span>Need</span>
            <span>Quantity</span>
            <span>Needed By</span>
            <span>Priority</span>
            <span>Status</span>
            <span className="text-right">Details</span>
          </div>
          <div className="divide-y divide-divider">
            {needs.map((need) => {
              const locationKey = need.requestingUnit?.locationKey;
              const location = locationKey
                ? locationMap.get(locationKey)
                : undefined;
              const priorityLabel = formatPriority(need.priority);
              const neededBy = formatTimeline(need);
              const formattedStatus = formatStatus(need.status);
              const createdAt = formatDate(need.createdAt);
              const updatedAt = formatDate(need.updatedAt);
              const hasMeta =
                Boolean(priorityLabel) ||
                Boolean(formattedStatus) ||
                Boolean(location);
              const locationLine1 = location?.address.line1;
              const hasAuditDates = createdAt ?? updatedAt;
              const isExpanded = expandedNeedId === need.id;
              const quantityText =
                need.quantity !== undefined
                  ? `${need.quantity}${need.unit ? ` ${need.unit}` : ""}`
                  : "—";
              const displayTitle = need.title.trim()
                ? need.title
                : need.item.name;

              return (
                <div
                  key={need.id}
                  className="transition-colors hover:bg-default-50"
                >
                  <div className="flex flex-col gap-3 px-4 py-4 text-sm text-muted-foreground md:grid md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,120px)] md:items-center md:gap-4 md:px-6 md:text-base">
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-foreground md:text-sm md:font-medium">
                        {displayTitle}
                      </p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {neededBy ?? "Timeline not set"}
                      </p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        Item: {need.item.name}
                      </p>
                    </div>
                    <div className="md:text-sm">{quantityText}</div>
                    <div className="hidden text-sm md:block">
                      {neededBy ?? "Timeline not set"}
                    </div>
                    <div className="text-sm">
                      {priorityLabel ? (
                        <Chip
                          size="sm"
                          color={getPriorityColor(need.priority)}
                          variant="flat"
                        >
                          {priorityLabel}
                        </Chip>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                    <div className="text-sm">
                      {formattedStatus ? (
                        <Chip
                          size="sm"
                          color={getStatusColor(need.status)}
                          variant="flat"
                        >
                          {formattedStatus}
                        </Chip>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() =>
                          setExpandedNeedId((prev) =>
                            prev === need.id ? null : need.id,
                          )
                        }
                      >
                        {isExpanded ? "Hide details" : "View details"}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-divider px-4 pb-5 pt-4 text-sm text-muted-foreground md:px-6 md:pt-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                            Overview
                          </h3>
                          {need.description ? (
                            <p className="leading-relaxed text-foreground">
                              {need.description}
                            </p>
                          ) : (
                            <p>No additional description provided.</p>
                          )}
                          {need.item.description && (
                            <p className="text-xs text-muted-foreground">
                              Item detail: {need.item.description}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                            Logistics
                          </h3>
                          {location ? (
                            <div className="space-y-1">
                              <p className="text-foreground">
                                {location.label ?? location.key}
                              </p>
                              {locationLine1 && (
                                <p className="text-xs">{locationLine1}</p>
                              )}
                            </div>
                          ) : (
                            <p>Location not specified.</p>
                          )}
                          {neededBy && (
                            <p className="text-xs text-muted-foreground">
                              {neededBy}
                            </p>
                          )}
                        </div>
                      </div>

                      {need.notes && (
                        <div className="mt-4 rounded-md bg-muted/30 p-3 text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            Notes:
                          </span>{" "}
                          {need.notes}
                        </div>
                      )}

                      {hasMeta && !need.notes && <div className="mt-2" />}

                      {hasAuditDates ? (
                        <div className="mt-4 border-t border-divider pt-3 text-xs text-muted-foreground">
                          {createdAt && <span>Created: {createdAt}</span>}
                          {createdAt && updatedAt ? <span> • </span> : null}
                          {updatedAt ? <span>Updated: {updatedAt}</span> : null}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
