"use client";

import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import type { ReactNode } from "react";
import { useTenant } from "../../../../components/TenantProvider";
import {
  formatAmountByCurrency,
  formatDate,
} from "../../components/needFormatters";
import type {
  FinancialNeed,
  HumanNeed,
  MaterialNeed,
  Need,
  ServiceNeed,
} from "~/modules/needs/types";
import { JobNeedDetails } from "./JobNeedDetails";

interface NeedDetailsProps {
  need: Need;
}

interface DetailSectionProps {
  title: string;
  children: ReactNode;
}

function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section className="rounded-xl border border-divider bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim().length === 0)
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-divider bg-muted/20 p-4 text-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

export function NeedDetails({ need }: NeedDetailsProps) {
  const { tenant } = useTenant();

  const backHref = `/w/${tenant}/needs`;
  const typeDisplay = need.type.charAt(0).toUpperCase() + need.type.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="flex items-center gap-3">
          <Button as={Link} href={backHref} variant="light" color="primary">
            Back to needs
          </Button>
          <Chip size="sm" color="primary" variant="flat">
            {typeDisplay}
          </Chip>
        </div>

        <div className="mt-8 grid gap-6">
          {renderNeedSpecificSections(need)}

          {need.notes ? (
            <DetailSection title="Notes">
              <p className="text-sm text-muted-foreground">{need.notes}</p>
            </DetailSection>
          ) : null}

          {need.procurement ? (
            <DetailSection title="Procurement">
              <ProcurementDetails procurement={need.procurement} />
            </DetailSection>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function renderNeedSpecificSections(need: Need) {
  switch (need.type) {
    case "material":
      return <MaterialNeedDetails need={need} />;
    case "service":
      return <ServiceNeedDetails need={need} />;
    case "human":
      return <HumanNeedDetails need={need} />;
    case "financial":
      return <FinancialNeedDetails need={need} />;
    case "job":
      return <JobNeedDetails need={need} />;
    default:
      return null;
  }
}

function MaterialNeedDetails({ need }: { need: MaterialNeed }) {
  const attributeEntries = Object.entries(need.item.attributes ?? {});

  return (
    <DetailSection title="Material Details">
      <InfoGrid>
        <InfoRow label="Item Name" value={need.item.name} />
        <InfoRow label="Category" value={need.item.category} />
        <InfoRow label="Brand" value={need.item.brand ?? "Not provided"} />
        <InfoRow
          label="Model"
          value={need.item.modelNumber ?? "Not provided"}
        />
        <InfoRow label="Unit" value={need.item.unitLabel ?? "Not provided"} />
      </InfoGrid>

      {attributeEntries.length > 0 ? (
        <div>
          <p className="text-sm font-medium text-foreground">Attributes</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {attributeEntries.map(([key, value]) => (
              <li key={key}>
                <span className="font-medium text-foreground">{key}:</span>{" "}
                {value}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {need.item.description ? (
        <p className="text-sm text-muted-foreground">{need.item.description}</p>
      ) : null}
    </DetailSection>
  );
}

function ServiceNeedDetails({ need }: { need: ServiceNeed }) {
  return (
    <DetailSection title="Service Details">
      <InfoGrid>
        <InfoRow
          label="Category"
          value={need.serviceCategory ?? "Not provided"}
        />
        <InfoRow label="Quantity" value={need.quantity ?? "Not specified"} />
        <InfoRow
          label="Bids Close"
          value={
            need.bidsCloseAt ? formatDate(need.bidsCloseAt) : "Not specified"
          }
        />
        {need.rfpUrl ? (
          <InfoRow
            label="RFP"
            value={
              <Link
                href={need.rfpUrl}
                className="text-primary underline"
                target="_blank"
                rel="noreferrer"
              >
                View RFP
              </Link>
            }
          />
        ) : null}
      </InfoGrid>

      {need.statementOfWork && need.statementOfWork.length > 0 ? (
        <div>
          <p className="text-sm font-medium text-foreground">
            Statement of Work
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {need.statementOfWork.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </DetailSection>
  );
}

function HumanNeedDetails({ need }: { need: HumanNeed }) {
  return (
    <DetailSection title="Human Support Details">
      <InfoGrid>
        <InfoRow
          label="Role Summary"
          value={need.roleSummary ?? "Not provided"}
        />
        <InfoRow label="Headcount" value={need.headcount ?? "Not specified"} />
        <InfoRow label="Quantity" value={need.quantity ?? "Not specified"} />
        <InfoRow
          label="Shift Pattern"
          value={need.shiftPattern ?? "Not specified"}
        />
      </InfoGrid>

      {need.skills && need.skills.length > 0 ? (
        <div>
          <p className="text-sm font-medium text-foreground">Skills Needed</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {need.skills.map((skill) => (
              <Chip key={skill} size="sm" variant="flat">
                {skill}
              </Chip>
            ))}
          </ul>
        </div>
      ) : null}
    </DetailSection>
  );
}

function FinancialNeedDetails({ need }: { need: FinancialNeed }) {
  return (
    <DetailSection title="Financial Details">
      <InfoGrid>
        <InfoRow
          label="Target Amount"
          value={formatAmountByCurrency(need.targetAmount) ?? "Not specified"}
        />
        <InfoRow
          label="Pledge URL"
          value={
            need.pledgeUrl ? (
              <Link
                href={need.pledgeUrl}
                className="text-primary underline"
                target="_blank"
                rel="noreferrer"
              >
                Support this need
              </Link>
            ) : (
              "Not provided"
            )
          }
        />
      </InfoGrid>
    </DetailSection>
  );
}

function ProcurementDetails({
  procurement,
}: {
  procurement: NonNullable<Need["procurement"]>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <InfoRow
        label="Supplier"
        value={procurement.supplier ?? "Not specified"}
      />
      <InfoRow
        label="Status"
        value={
          procurement.status ? (
            <Chip size="sm" variant="flat">
              {formatProcurementStatus(procurement.status)}
            </Chip>
          ) : (
            "Not specified"
          )
        }
      />
      <InfoRow
        label="Estimated Cost"
        value={
          typeof procurement.estimatedCost === "number" && procurement.currency
            ? new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: procurement.currency,
                maximumFractionDigits: 0,
              }).format(procurement.estimatedCost)
            : "Not provided"
        }
      />
      {procurement.notes ? (
        <InfoRow label="Notes" value={procurement.notes} />
      ) : null}
    </div>
  );
}

function InfoGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function formatProcurementStatus(
  status: NonNullable<Need["procurement"]>["status"],
) {
  if (!status) return "";
  return status
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
