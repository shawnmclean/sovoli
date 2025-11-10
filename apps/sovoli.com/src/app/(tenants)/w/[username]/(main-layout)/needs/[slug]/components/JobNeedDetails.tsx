"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@sovoli/ui/components/button";
import {
  BriefcaseIcon,
  GraduationCapIcon,
  UsersIcon,
  DollarSignIcon,
  MapPinIcon,
  MessageCircleIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useTenant } from "../../../../components/TenantProvider";

import { gradientBorderButton } from "~/components/GradientBorderButton";
import {
  formatEmploymentType,
  formatTimeline,
} from "../../components/needFormatters";
import type { JobNeed } from "~/modules/needs/types";
import type { ReactNode } from "react";

interface JobNeedDetailsProps {
  need: JobNeed;
}

export function JobNeedDetails({ need }: JobNeedDetailsProps) {
  const { tenant, orgInstance } = useTenant();
  const position = need.position;

  const employmentType = formatEmploymentType(position?.employmentType);
  const timeline = formatTimeline(need);
  const openings = typeof need.quantity === "number" ? need.quantity : null;

  const compensationLabel = useMemo(
    () => formatCompactCompensation(position?.compensationRange),
    [position?.compensationRange],
  );

  if (!position) {
    return (
      <div className="rounded-2xl border border-divider bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Position details have not been provided yet. Check back soon or reach
          out to the school for more information.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="rounded-3xl border border-divider bg-card p-4 text-center shadow-sm">
        <div className="flex justify-center">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-divider bg-muted">
            {orgInstance.org.logo ? (
              <Image
                src={orgInstance.org.logo}
                alt={orgInstance.org.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-muted-foreground">
                {orgInstance.org.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {orgInstance.org.name}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          {position.name || need.title}
        </h2>
        {position.description || need.description ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {position.description || need.description}
          </p>
        ) : null}
      </header>

      <SummaryRow
        facts={[
          compensationLabel
            ? {
                key: "salary",
                icon: <DollarSignIcon className="h-5 w-5 text-primary" />,
                label: "Salary",
                value: compensationLabel,
              }
            : null,
          employmentType
            ? {
                key: "type",
                icon: <BriefcaseIcon className="h-5 w-5 text-primary" />,
                label: "Job type",
                value: employmentType,
              }
            : null,
          openings
            ? {
                key: "openings",
                icon: <UsersIcon className="h-5 w-5 text-primary" />,
                label: "Openings",
                value: `${openings} position${openings > 1 ? "s" : ""}`,
              }
            : null,
          need.requestingUnit?.locationKey
            ? {
                key: "location",
                icon: <MapPinIcon className="h-5 w-5 text-primary" />,
                label: "Location",
                value: resolveLocationLabel(
                  need.requestingUnit.locationKey,
                  orgInstance.org.locations,
                ),
              }
            : null,
        ]}
      />

      {position.qualifications && position.qualifications.length > 0 ? (
        <section className="space-y-3 rounded-3xl border border-divider bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <GraduationCapIcon className="h-4 w-4 text-primary" />
            Qualifications
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {position.qualifications.map((qualification) => (
              <li
                key={qualification}
                className="rounded-xl border border-divider bg-muted/30 px-3 py-2 text-foreground"
              >
                {qualification}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <WhatsAppButton
        tenant={tenant}
        orgInstance={orgInstance}
        needTitle={position.name || need.title}
      />
      {timeline ? (
        <p className="text-center text-xs font-medium text-muted-foreground">
          Needed by {timeline.replace(/^Needed by\s*/i, "")}
        </p>
      ) : null}
    </div>
  );
}

interface SummaryFact {
  key: string;
  icon: ReactNode;
  label: string;
  value: string;
}

function FactCard({ icon, label, value }: SummaryFact) {
  return (
    <div className="flex min-w-[88px] flex-1 flex-col items-center gap-2 rounded-2xl border border-divider bg-card p-3 text-center shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function SummaryRow({ facts }: { facts: (SummaryFact | null)[] }) {
  const visibleFacts = facts.filter(
    (fact): fact is SummaryFact => fact !== null,
  );

  if (visibleFacts.length === 0) return null;

  return (
    <section className="rounded-3xl border border-divider bg-card px-3 py-4">
      <div className="flex flex-wrap items-stretch justify-center gap-3">
        {visibleFacts.map((fact) => (
          <FactCard
            key={fact.key}
            icon={fact.icon}
            label={fact.label}
            value={fact.value}
          />
        ))}
      </div>
    </section>
  );
}

function resolveLocationLabel(
  key: string,
  locations: { key: string; label?: string }[],
) {
  const record = locations.find((item) => item.key === key);
  return record?.label ?? record?.key ?? "On campus";
}

function WhatsAppButton({
  tenant,
  orgInstance,
  needTitle,
}: {
  tenant: string;
  orgInstance: ReturnType<typeof useTenant>["orgInstance"];
  needTitle: string | undefined;
}) {
  const { phone } = findWhatsappContact(orgInstance);
  const fallbackUrl = `/w/${tenant}/contact`;

  if (!phone) {
    return (
      <Button
        as={Link}
        href={fallbackUrl}
        color="primary"
        size="lg"
        fullWidth
        className={gradientBorderButton()}
      >
        Contact the school
      </Button>
    );
  }

  const encodedMessage = encodeURIComponent(
    [
      "Hello!",
      `I'm interested in the ${needTitle ?? "teaching opportunity"} at ${
        orgInstance.org.name
      }.`,
      "Could you share more details?",
    ].join(" "),
  );
  const whatsappUrl = `https://wa.me/${sanitizePhoneNumber(
    phone,
  )}?text=${encodedMessage}`;

  return (
    <Button
      as={Link}
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      color="success"
      startContent={<MessageCircleIcon className="h-5 w-5" />}
      className={gradientBorderButton()}
      size="lg"
      fullWidth
    >
      Chat via WhatsApp
    </Button>
  );
}

function findWhatsappContact({
  org,
}: ReturnType<typeof useTenant>["orgInstance"]): {
  phone: string | null;
  label?: string;
} {
  const locationContact = org.locations
    .flatMap((location) => location.contacts)
    .find((contact) => contact.type === "whatsapp" && contact.isPublic);

  if (locationContact) {
    return locationContact.label
      ? { phone: locationContact.value, label: locationContact.label }
      : { phone: locationContact.value };
  }

  const personContact =
    org.internalCRM?.people
      .flatMap((person) => person.contacts)
      .find((contact) => contact.type === "whatsapp" && contact.isPublic) ??
    null;

  return personContact
    ? personContact.label
      ? { phone: personContact.value, label: personContact.label }
      : { phone: personContact.value }
    : { phone: null };
}

function sanitizePhoneNumber(value: string) {
  return value.replace(/[^+\d]/g, "");
}
type CompensationRange = NonNullable<JobNeed["position"]>["compensationRange"];

function formatCompactCompensation(range?: CompensationRange | null) {
  if (!range) return null;

  const { min, max, period } = range;
  const currencyData = pickPrimaryCurrency(min, max);
  if (!currencyData) return null;
  const { minValue, maxValue } = currencyData;

  const periodConfig =
    period === "annual"
      ? { multiplier: 1, suffix: "Y" }
      : period === "monthly"
        ? { multiplier: 1, suffix: "M" }
        : period === "hourly"
          ? { multiplier: 160, suffix: "M" }
          : { multiplier: 1, suffix: "M" };

  const scale = (value: number | null) =>
    value === null ? null : value * periodConfig.multiplier;

  const scaledMin = scale(minValue);
  const scaledMax = scale(maxValue);

  if (scaledMin === null && scaledMax === null) return null;

  const minLabel = formatMagnitude(scaledMin);
  const maxLabel = formatMagnitude(scaledMax);

  const amount =
    minLabel && maxLabel && minLabel !== maxLabel
      ? `${minLabel}-${maxLabel}`
      : (minLabel ?? maxLabel);

  if (!amount) return null;

  return `${amount}/${periodConfig.suffix}`;
}

function pickPrimaryCurrency(
  min?: Record<string, number | undefined>,
  max?: Record<string, number | undefined>,
) {
  const minEntries = extractNumericEntries(min);
  const maxEntries = extractNumericEntries(max);

  const primaryEntry = [...minEntries, ...maxEntries][0];
  if (!primaryEntry) return null;

  const [primaryCode] = primaryEntry;

  const findValue = (entries: [string, number][]): number | null =>
    entries.find(([code]) => code === primaryCode)?.[1] ?? null;

  return {
    minValue: findValue(minEntries),
    maxValue: findValue(maxEntries),
  };
}

function formatMagnitude(value: number | null) {
  if (value === null) return null;
  const absolute = Math.abs(value);

  if (absolute >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (absolute >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return value.toLocaleString();
}

function extractNumericEntries(source?: Record<string, number | undefined>) {
  if (!source) return [];
  return Object.entries(source).filter(
    (entry): entry is [string, number] => typeof entry[1] === "number",
  );
}
