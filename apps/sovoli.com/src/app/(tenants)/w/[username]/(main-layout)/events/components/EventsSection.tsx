import type { OrgInstance } from "~/modules/organisations/types";
import { EventsTabs } from "./EventsTabs";

export interface EventsSectionProps {
  orgInstance: OrgInstance;
}

export function EventsSection({ orgInstance }: EventsSectionProps) {
  return <EventsTabs orgInstance={orgInstance} />;
}
