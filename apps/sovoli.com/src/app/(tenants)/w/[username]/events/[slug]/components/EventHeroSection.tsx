import type { Event } from "~/modules/events/types";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";
import { format, parseISO, parse } from "date-fns";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardBody } from "@sovoli/ui/components/card";

// Utility function to format 24-hour time "09:00" to "9AM" using date-fns
const formatTime = (timeString: string): string => {
  try {
    // Parse 24-hour time string and create a date object for today
    const timeDate = parse(timeString, "HH:mm", new Date());

    // Format to 12-hour format without leading zeros for hours
    return format(timeDate, "h:mm a").replace(/^0+/, "").replace(/:00/, "");
  } catch {
    // Fallback to original string if parsing fails
    return timeString;
  }
};

interface EventHeroSectionProps {
  orgInstance: OrgInstanceWithWebsite;
  event: Event;
}

export function EventHeroSection({ event }: EventHeroSectionProps) {
  const startDate = parseISO(event.startDate);

  return (
    <section className="my-6 border-b border-default-200 pb-6 text-center">
      {/* Event Name */}
      <h1 className="text-2xl leading-tight tracking-tight my-4">
        {event.name}
      </h1>

      {/* Event Description */}
      {event.description && (
        <p className="text-sm text-foreground-500 max-w-3xl mx-auto mb-4">
          {event.description}
        </p>
      )}

      {/* Event Info Pill */}
      <Card className="inline-flex mx-auto">
        <CardBody className="px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-4 text-foreground-500 text-xs sm:text-sm">
            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-1 sm:gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}

            {/* Separator - only show if both location and date/time exist */}
            {event.location && "•"}

            {/* Date & Time */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(startDate, "dd MMM")}
                {event.startTime && ` - ${formatTime(event.startTime)}`}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
