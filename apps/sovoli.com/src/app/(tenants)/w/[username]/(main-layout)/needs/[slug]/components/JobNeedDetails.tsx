"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@sovoli/ui/components/button";
import {
  BriefcaseIcon,
  CalendarIcon,
  GraduationCapIcon,
  UsersIcon,
  DollarSignIcon,
  MapPinIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useTenant } from "../../../../components/TenantProvider";
import {
  formatAmountByCurrency,
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

  const compensationLabel = useMemo(() => {
    if (!position?.compensationRange) return null;

    const { min, max, period } = position.compensationRange;
    const minFormatted = min ? formatAmountByCurrency(min) : null;
    const maxFormatted = max ? formatAmountByCurrency(max) : null;

    const range =
      minFormatted && maxFormatted
        ? `${minFormatted} – ${maxFormatted}`
        : (minFormatted ?? maxFormatted);

    if (!range) return null;

    if (!period) return range;

    const periodLabel =
      period.charAt(0).toUpperCase() + period.slice(1).toLowerCase();
    return `${range} • ${periodLabel}`;
  }, [position?.compensationRange]);

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

  const ctaHref =
    position.url && position.url.trim().length > 0
      ? position.url
      : `/w/${tenant}/contact`;

  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-divider bg-card p-5 text-center shadow-sm">
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
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {position.description || need.description}
          </p>
        ) : null}
      </header>

      <section className="grid gap-3 rounded-3xl border border-divider bg-card p-4 sm:grid-cols-2">
        {compensationLabel ? (
          <FactCard
            icon={<DollarSignIcon className="h-5 w-5 text-primary" />}
            label="Salary"
            value={compensationLabel}
          />
        ) : null}

        {employmentType ? (
          <FactCard
            icon={<BriefcaseIcon className="h-5 w-5 text-primary" />}
            label="Job Type"
            value={employmentType}
          />
        ) : null}

        {openings ? (
          <FactCard
            icon={<UsersIcon className="h-5 w-5 text-primary" />}
            label="Positions"
            value={`${openings} opening${openings > 1 ? "s" : ""}`}
          />
        ) : null}

        {timeline ? (
          <FactCard
            icon={<CalendarIcon className="h-5 w-5 text-primary" />}
            label="Needed By"
            value={timeline}
          />
        ) : null}

        {need.requestingUnit?.locationKey ? (
          <FactCard
            icon={<MapPinIcon className="h-5 w-5 text-primary" />}
            label="Location"
            value={resolveLocationLabel(
              need.requestingUnit.locationKey,
              orgInstance.org.locations,
            )}
          />
        ) : null}
      </section>

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

      <Button
        as={Link}
        href={ctaHref}
        color="primary"
        className="w-full rounded-full py-5 text-base font-semibold"
      >
        Apply Now
      </Button>
    </div>
  );
}

function FactCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-divider bg-muted/20 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function resolveLocationLabel(
  key: string,
  locations: { key: string; label?: string }[],
) {
  const record = locations.find((item) => item.key === key);
  return record?.label ?? record?.key ?? "On campus";
}
