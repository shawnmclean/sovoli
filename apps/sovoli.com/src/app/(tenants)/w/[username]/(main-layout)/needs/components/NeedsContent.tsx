"use client";

import {
  isFinancialNeed,
  isHumanNeed,
  isJobNeed,
  isMaterialNeed,
  isServiceNeed,
} from "~/modules/needs/types";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";
import {
  FinancialNeedsList,
  HumanNeedsList,
  JobNeedsList,
  MaterialNeedsList,
  ServiceNeedsList,
} from "./NeedSections";

interface NeedsContentProps {
  orgInstance: OrgInstanceWithWebsite;
}

export function NeedsContent({ orgInstance }: NeedsContentProps) {
  const needsModule = orgInstance.needsModule;
  const needs = needsModule?.needs ?? [];

  if (needs.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              Organization Needs
            </h1>
            <p className="text-muted-foreground">
              There are no needs listed for{" "}
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
  const materialNeeds = needs.filter(isMaterialNeed);
  const serviceNeeds = needs.filter(isServiceNeed);
  const humanNeeds = needs.filter(isHumanNeed);
  const financialNeeds = needs.filter(isFinancialNeed);
  const jobNeeds = needs.filter(isJobNeed);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-3 py-6 space-y-6 sm:px-4 sm:py-8 sm:space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Needs
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Projects, Procurements, Job Openings, and more.
          </p>
        </header>

        <div className="space-y-10">
          {materialNeeds.length > 0 ? (
            <MaterialNeedsList
              needs={materialNeeds}
              locationMap={locationMap}
            />
          ) : null}

          {serviceNeeds.length > 0 ? (
            <ServiceNeedsList needs={serviceNeeds} locationMap={locationMap} />
          ) : null}

          {humanNeeds.length > 0 ? (
            <HumanNeedsList needs={humanNeeds} locationMap={locationMap} />
          ) : null}

          {financialNeeds.length > 0 ? (
            <FinancialNeedsList
              needs={financialNeeds}
              locationMap={locationMap}
            />
          ) : null}

          {jobNeeds.length > 0 ? (
            <JobNeedsList needs={jobNeeds} locationMap={locationMap} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
