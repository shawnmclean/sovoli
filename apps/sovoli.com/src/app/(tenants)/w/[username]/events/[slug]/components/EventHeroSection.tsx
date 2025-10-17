import type { Event } from "~/modules/events/types";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";
import { format, parseISO } from "date-fns";
import { Calendar, MapPin, Clock } from "lucide-react";

interface EventHeroSectionProps {
  orgInstance: OrgInstanceWithWebsite;
  event: Event;
}

export function EventHeroSection({ event }: EventHeroSectionProps) {
  const startDate = parseISO(event.startDate);
  const endDate = event.endDate ? parseISO(event.endDate) : null;

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {event.name}
        </h1>
        {event.tagline && (
          <p className="text-lg text-muted-foreground mb-4">{event.tagline}</p>
        )}
        {event.description && (
          <p className="text-foreground/80 leading-relaxed">
            {event.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center space-x-2 text-foreground/80">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">
              {format(startDate, "EEEE, MMMM do, yyyy")}
            </p>
            {endDate && endDate.getTime() !== startDate.getTime() && (
              <p className="text-sm text-muted-foreground">
                to {format(endDate, "EEEE, MMMM do, yyyy")}
              </p>
            )}
          </div>
        </div>

        {event.time && (
          <div className="flex items-center space-x-2 text-foreground/80">
            <Clock className="h-5 w-5 text-success" />
            <div>
              <p className="font-medium">{event.time}</p>
            </div>
          </div>
        )}

        {event.location && (
          <div className="flex items-center space-x-2 text-foreground/80">
            <MapPin className="h-5 w-5 text-danger" />
            <div>
              <p className="font-medium">{event.location}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
