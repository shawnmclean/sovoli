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
      return "High priority";
    case "medium":
      return "Medium priority";
    case "low":
      return "Low priority";
    default:
      return null;
  }
}

export function ProcurementContent({ orgInstance }: ProcurementContentProps) {
  const procurementModule = orgInstance.procurementModule;
  const needs = procurementModule?.needs ?? [];

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

        <div className="space-y-4 sm:space-y-6">
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

            return (
              <article
                key={need.id}
                className="rounded-lg border border-divider bg-card text-card-foreground p-5 space-y-4 shadow-sm sm:p-6"
              >
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                    {need.title}
                  </h2>
                  {need.description && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {need.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                    <span className="font-medium text-foreground sm:text-base">
                      Item: {need.item.name}
                    </span>
                    {need.quantity && (
                      <span className="text-sm sm:text-base">
                        Quantity: {need.quantity}
                        {need.unit ? ` ${need.unit}` : ""}
                      </span>
                    )}
                    {need.item.description && (
                      <span className="leading-snug sm:max-w-md">
                        {need.item.description}
                      </span>
                    )}
                  </div>
                  {neededBy && (
                    <div className="text-sm text-muted-foreground sm:text-base">
                      {neededBy}
                    </div>
                  )}
                </div>

                {hasMeta && (
                  <dl className="grid gap-3 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground sm:grid-cols-2 sm:text-sm">
                    {priorityLabel && (
                      <div>
                        <dt className="font-semibold text-foreground">
                          Priority
                        </dt>
                        <dd>{priorityLabel}</dd>
                      </div>
                    )}
                    {formattedStatus && (
                      <div>
                        <dt className="font-semibold text-foreground">
                          Status
                        </dt>
                        <dd>{formattedStatus}</dd>
                      </div>
                    )}
                    {location && (
                      <div className="sm:col-span-2">
                        <dt className="font-semibold text-foreground">
                          Location
                        </dt>
                        <dd>
                          {location.label ?? location.key}
                          {locationLine1 ? ` — ${locationLine1}` : ""}
                        </dd>
                      </div>
                    )}
                  </dl>
                )}

                {need.notes && (
                  <div className="rounded-md bg-muted/30 p-3 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Notes:
                    </span>{" "}
                    {need.notes}
                  </div>
                )}

                {hasAuditDates ? (
                  <div className="border-t border-divider pt-3 text-xs text-muted-foreground sm:text-sm">
                    {createdAt && <span>Created: {createdAt}</span>}
                    {createdAt && updatedAt ? <span> • </span> : null}
                    {updatedAt ? <span>Updated: {updatedAt}</span> : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
