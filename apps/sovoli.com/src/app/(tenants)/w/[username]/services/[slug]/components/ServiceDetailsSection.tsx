"use client";

import type { Service } from "~/modules/services/types";

interface ServiceDetailsSectionProps {
  service: Service;
}

export function ServiceDetailsSection({ service }: ServiceDetailsSectionProps) {
  const commonServices = service.commonServices;
  const whoThisIsFor = service.whoThisIsFor;

  if (!commonServices?.length && !whoThisIsFor?.length) {
    return null;
  }

  return (
    <section className="my-6 border-b border-default-200 pb-6 space-y-6">
      {commonServices && commonServices.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Common services
          </h2>
          <ul className="list-disc list-inside space-y-2 text-foreground-600">
            {commonServices.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {whoThisIsFor && whoThisIsFor.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Who this is for
          </h2>
          <ul className="list-disc list-inside space-y-2 text-foreground-600">
            {whoThisIsFor.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
