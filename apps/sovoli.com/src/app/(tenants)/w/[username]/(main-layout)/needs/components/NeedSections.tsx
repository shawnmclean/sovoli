"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import type { AmountByCurrency } from "~/modules/core/economics/types";
import type { OrgLocation } from "~/modules/organisations/types";
import type {
  FinancialNeed,
  HumanNeed,
  JobNeed,
  MaterialNeed,
  Need,
  ServiceNeed,
} from "~/modules/needs/types";
import type { ItemCategory } from "~/modules/core/items/types";
import {
  formatEmploymentType,
  formatAmountByCurrency,
  formatDate,
  formatPriority,
  formatStatus,
  formatTimeline,
  getPriorityChipColor,
  getStatusChipColor,
} from "./needFormatters";

type LocationMap = Map<OrgLocation["key"], OrgLocation>;

function getCategoryLabel(category: ItemCategory): string {
  const names: string[] = [];
  let current: ItemCategory | undefined = category;
  while (current) {
    names.unshift(current.name);
    current = current.parent;
  }
  return names.join(" / ");
}

interface NeedListSectionProps<TNeed extends Need> {
  title: string;
  subtitle?: string;
  needs: TNeed[];
  locationMap: LocationMap;
  renderQuantity?: (need: TNeed) => ReactNode;
  renderMobileMeta?: (need: TNeed) => ReactNode;
  renderDetailSections?: (need: TNeed) => ReactNode;
  getDisplayTitle?: (need: TNeed) => string;
}

function NeedListSection<TNeed extends Need>({
  title,
  subtitle,
  needs,
  locationMap,
  renderQuantity,
  renderMobileMeta,
  renderDetailSections,
  getDisplayTitle,
}: NeedListSectionProps<TNeed>) {
  const [expandedNeedId, setExpandedNeedId] = useState<string | null>(null);

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
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
            const hasAuditDates = createdAt ?? updatedAt;
            const isExpanded = expandedNeedId === need.slug;
            const addressLine1 = location ? location.address.line1 : undefined;
            const defaultTitle =
              need.title.trim().length > 0 ? need.title : "Untitled need";
            const displayTitle = getDisplayTitle?.(need) ?? defaultTitle;
            const quantityContent =
              renderQuantity?.(need) ??
              (typeof need.quantity === "number" ? need.quantity : "—");

            return (
              <div
                key={need.slug}
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
                    {renderMobileMeta?.(need)}
                  </div>

                  <div className="md:text-sm">{quantityContent}</div>

                  <div className="hidden text-sm md:block">
                    {neededBy ?? "Timeline not set"}
                  </div>

                  <div className="text-sm">
                    {priorityLabel ? (
                      <Chip
                        size="sm"
                        color={getPriorityChipColor(need.priority)}
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
                        color={getStatusChipColor(need.status)}
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
                          prev === need.slug ? null : need.slug,
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
                            {addressLine1 ? (
                              <p className="text-xs">{addressLine1}</p>
                            ) : null}
                          </div>
                        ) : (
                          <p>Location not specified.</p>
                        )}
                        {neededBy ? (
                          <p className="text-xs text-muted-foreground">
                            {neededBy}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {renderDetailSections?.(need)}

                    {need.notes ? (
                      <div className="mt-4 rounded-md bg-muted/30 p-3 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Notes:
                        </span>{" "}
                        {need.notes}
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        as={Link}
                        href={`/needs/${need.slug}`}
                        size="sm"
                        color="primary"
                      >
                        Open full details
                      </Button>
                    </div>

                    {hasAuditDates ? (
                      <div className="mt-4 border-t border-divider pt-3 text-xs text-muted-foreground">
                        {createdAt ? <span>Created: {createdAt}</span> : null}
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
    </section>
  );
}

function renderAmountSection(label: string, amount?: AmountByCurrency) {
  const formatted = formatAmountByCurrency(amount);
  if (!formatted) return null;

  return (
    <p className="text-sm text-foreground">
      <span className="font-medium">{label}: </span>
      {formatted}
    </p>
  );
}

export function MaterialNeedsList({
  needs,
  locationMap,
}: {
  needs: MaterialNeed[];
  locationMap: LocationMap;
}) {
  return (
    <NeedListSection
      title="Materials"
      needs={needs}
      locationMap={locationMap}
      getDisplayTitle={(need) => {
        const title = need.title.trim();
        if (title.length > 0) return need.title;
        const itemName = need.item.name.trim();
        return itemName.length > 0 ? need.item.name : "Untitled item";
      }}
      renderQuantity={(need) => {
        if (need.quantity === undefined) return "—";
        const unitLabel = need.item.unitLabel;
        return unitLabel ? `${need.quantity} ${unitLabel}` : need.quantity;
      }}
      renderMobileMeta={(need) => {
        const itemName = need.item.name.trim();
        if (itemName.length === 0) return null;
        return (
          <p className="text-xs text-muted-foreground md:hidden">
            Item: {need.item.name}
          </p>
        );
      }}
      renderDetailSections={(need) => {
        const { item } = need;
        const attributeEntries = Object.entries(item.attributes ?? {});

        return (
          <div className="mt-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
              Item Details
            </h3>
            <div className="space-y-1 text-sm text-foreground">
              <p>
                <span className="font-medium">Category:</span>{" "}
                {getCategoryLabel(item.category)}
              </p>
              {item.brand ? (
                <p>
                  <span className="font-medium">Brand:</span> {item.brand}
                </p>
              ) : null}
              {item.modelNumber ? (
                <p>
                  <span className="font-medium">Model:</span> {item.modelNumber}
                </p>
              ) : null}
              {attributeEntries.length > 0 ? (
                <div>
                  <span className="font-medium">Attributes:</span>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {attributeEntries.map(([key, value]) => (
                      <li key={key}>
                        <span className="font-medium text-foreground">
                          {key}:
                        </span>{" "}
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {item.description ? (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
          </div>
        );
      }}
    />
  );
}

export function ServiceNeedsList({
  needs,
  locationMap,
}: {
  needs: ServiceNeed[];
  locationMap: LocationMap;
}) {
  return (
    <NeedListSection
      title="Service Needs"
      subtitle="Contracted services or external support requests."
      needs={needs}
      locationMap={locationMap}
      renderQuantity={(need) => need.quantity ?? "—"}
      renderDetailSections={(need) => (
        <div className="mt-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Service Details
          </h3>
          <div className="space-y-2 text-sm text-foreground">
            {need.serviceCategory ? (
              <p>
                <span className="font-medium">Category:</span>{" "}
                {need.serviceCategory}
              </p>
            ) : null}
            {need.statementOfWork && need.statementOfWork.length > 0 ? (
              <div>
                <span className="font-medium">Statement of work:</span>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {need.statementOfWork.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {need.rfpUrl ? (
              <p className="text-sm text-primary">
                <a href={need.rfpUrl} target="_blank" rel="noreferrer">
                  View RFP
                </a>
              </p>
            ) : null}
            {need.bidsCloseAt ? (
              <p>
                <span className="font-medium">Bids close:</span>{" "}
                {formatDate(need.bidsCloseAt) ?? need.bidsCloseAt}
              </p>
            ) : null}
          </div>
        </div>
      )}
    />
  );
}

export function HumanNeedsList({
  needs,
  locationMap,
}: {
  needs: HumanNeed[];
  locationMap: LocationMap;
}) {
  return (
    <NeedListSection
      title="Human Support Needs"
      subtitle="Volunteer or temporary labor requirements."
      needs={needs}
      locationMap={locationMap}
      renderQuantity={(need) => need.headcount ?? need.quantity ?? "—"}
      renderMobileMeta={(need) =>
        need.roleSummary ? (
          <p className="text-xs text-muted-foreground md:hidden">
            Role: {need.roleSummary}
          </p>
        ) : null
      }
      renderDetailSections={(need) => (
        <div className="mt-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Role Details
          </h3>
          <div className="space-y-2 text-sm text-foreground">
            {need.roleSummary ? (
              <p>
                <span className="font-medium">Role summary:</span>{" "}
                {need.roleSummary}
              </p>
            ) : null}
            {need.headcount !== undefined ? (
              <p>
                <span className="font-medium">Headcount needed:</span>{" "}
                {need.headcount}
              </p>
            ) : null}
            {need.shiftPattern ? (
              <p>
                <span className="font-medium">Shift pattern:</span>{" "}
                {need.shiftPattern}
              </p>
            ) : null}
            {need.skills && need.skills.length > 0 ? (
              <div>
                <span className="font-medium">Desired skills:</span>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {need.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      )}
    />
  );
}

export function FinancialNeedsList({
  needs,
  locationMap,
}: {
  needs: FinancialNeed[];
  locationMap: LocationMap;
}) {
  return (
    <NeedListSection
      title="Financial Needs"
      subtitle="Funding, sponsorship, or donation goals."
      needs={needs}
      locationMap={locationMap}
      renderQuantity={(need) => need.quantity ?? "—"}
      renderDetailSections={(need) => (
        <div className="mt-4 space-y-3 text-sm text-foreground">
          {renderAmountSection("Target amount", need.targetAmount)}
          {renderAmountSection("Total budget", need.totalBudget)}
          {need.pledgeUrl ? (
            <p className="text-primary">
              <a href={need.pledgeUrl} target="_blank" rel="noreferrer">
                Contribute or pledge
              </a>
            </p>
          ) : null}
        </div>
      )}
    />
  );
}

export function JobNeedsList({
  needs,
  locationMap,
}: {
  needs: JobNeed[];
  locationMap: LocationMap;
}) {
  return (
    <NeedListSection
      title="Job Openings"
      needs={needs}
      locationMap={locationMap}
      renderQuantity={() => "—"}
      getDisplayTitle={(need) =>
        need.title.trim().length > 0
          ? need.title
          : (need.position?.name ?? "Open role")
      }
      renderMobileMeta={(need) =>
        need.position?.name ? (
          <p className="text-xs text-muted-foreground md:hidden">
            Position: {need.position.name}
          </p>
        ) : null
      }
      renderDetailSections={(need) => {
        const { position } = need;
        if (!position) return null;

        const qualifications = position.qualifications ?? [];
        const compensationRange = position.compensationRange;

        return (
          <div className="mt-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
              Position Details
            </h3>
            <div className="space-y-2 text-sm text-foreground">
              <p>
                <span className="font-medium">Position:</span> {position.name}
              </p>
              {position.description ? (
                <p className="text-sm text-muted-foreground">
                  {position.description}
                </p>
              ) : null}
              {(() => {
                const employmentTypeLabel = formatEmploymentType(
                  position.employmentType,
                );
                return employmentTypeLabel ? (
                  <p>
                    <span className="font-medium">Employment type:</span>{" "}
                    {employmentTypeLabel}
                  </p>
                ) : null;
              })()}
              {qualifications.length > 0 ? (
                <div>
                  <span className="font-medium">Qualifications:</span>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {qualifications.map((qualification) => (
                      <li key={qualification}>{qualification}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {compensationRange ? (
                <div className="space-y-1">
                  <span className="font-medium">Compensation:</span>
                  {(() => {
                    const minimum = formatAmountByCurrency(
                      compensationRange.min,
                    );
                    const maximum = formatAmountByCurrency(
                      compensationRange.max,
                    );
                    const joined = [minimum, maximum]
                      .filter((value): value is string => Boolean(value))
                      .join(" - ");

                    if (!joined && !compensationRange.period) {
                      return null;
                    }

                    return (
                      <p className="text-sm text-muted-foreground">
                        {joined}
                        {compensationRange.period
                          ? ` per ${compensationRange.period}`
                          : ""}
                      </p>
                    );
                  })()}
                </div>
              ) : null}
              {position.url ? (
                <p className="text-primary">
                  <a href={position.url} target="_blank" rel="noreferrer">
                    View position
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        );
      }}
    />
  );
}
