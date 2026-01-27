"use client";

import type { Service } from "~/modules/services/types";

interface ServiceDescriptionSectionProps {
  service: Service;
}

export function ServiceDescriptionSection({
  service,
}: ServiceDescriptionSectionProps) {
  const whatWeDo = service.whatWeDo;

  if (!whatWeDo) {
    return null;
  }

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">What we do</h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground-600 leading-relaxed">{whatWeDo}</p>
        </div>
      </div>
    </section>
  );
}
