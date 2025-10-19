import type { OrgInstance } from "~/modules/organisations/types";
import { EventCard } from "./EventCard"; // Event card component

export interface EventsSectionProps {
  orgInstance: OrgInstance;
}

export function EventsSection({ orgInstance }: EventsSectionProps) {
  const events = orgInstance.eventModule?.events ?? [];
  const upcomingEvents = orgInstance.eventModule?.upcomingEvents ?? [];

  // Filter events that are upcoming or current
  const displayEvents =
    upcomingEvents.length > 0
      ? upcomingEvents
      : events.filter(
          (event) => event.status === "upcoming" || event.status === "current",
        );

  if (displayEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <p className="text-muted-foreground">
          No upcoming events scheduled at this time. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join us for exciting events and activities throughout the school year
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayEvents.map((event) => (
          <EventCard key={event.id} event={event} orgInstance={orgInstance} />
        ))}
      </div>
    </div>
  );
}
