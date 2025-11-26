import type { Event } from "~/modules/events/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { Image } from "@sovoli/ui/components/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format, parseISO, parse } from "date-fns";

interface EventCardProps {
  event: Event;
  orgInstance: OrgInstance;
}

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

export function EventCard({
  event,
  orgInstance: _orgInstance,
}: EventCardProps) {
  const startDate = parseISO(event.startDate);

  return (
    <Card
      as={Link}
      href={`/events/${event.slug}`}
      className="overflow-hidden shadow-md transition hover:shadow-lg"
    >
      <CardBody className="flex flex-row p-0">
        {/* Event Image - Left Side */}
        <div className="w-32 min-h-32 flex-shrink-0 p-2 flex items-center justify-center">
          <div className="w-28 h-28">
            {event.media?.[0]?.url ? (
              <Image
                src={event.media[0].url}
                alt={event.name}
                width={112}
                height={112}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-default-100 flex items-center justify-center rounded-lg">
                <Calendar className="w-8 h-8 text-default-400" />
              </div>
            )}
          </div>
        </div>

        {/* Event Details - Right Side */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Event Title */}
            <h3 className="text-lg font-semibold text-foreground">
              {event.name}
            </h3>

            {/* Date & Time */}
            <div className="flex items-center gap-2 text-sm text-foreground-600">
              <Clock className="w-4 h-4 text-foreground-500" />
              <span>
                {format(startDate, "dd MMM")}
                {event.startTime && ` - ${formatTime(event.startTime)}`}
              </span>
            </div>
          </div>

          {/* Arrow Icon */}
          <div className="flex justify-end">
            <ArrowRight className="w-5 h-5 text-foreground-400" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
