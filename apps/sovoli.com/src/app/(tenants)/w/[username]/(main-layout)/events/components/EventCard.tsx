import type { Event } from "~/modules/events/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { Image } from "@sovoli/ui/components/image";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

interface EventCardProps {
  event: Event;
  orgInstance: OrgInstance;
}

export function EventCard({
  event,
  orgInstance: _orgInstance,
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours ?? "0", 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

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
            <Image
              src={event.photos?.[0]?.url ?? ""}
              alt={event.name}
              width={112}
              height={112}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Event Details - Right Side */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Event Title */}
            <h3 className="text-lg font-semibold text-foreground">
              {event.name}
            </h3>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-foreground-600">
              <Calendar className="w-4 h-4 text-foreground-500" />
              <span>{formatDate(event.startDate)}</span>
            </div>

            {/* Time */}
            {event.startTime && (
              <div className="flex items-center gap-2 text-sm text-foreground-600">
                <Clock className="w-4 h-4 text-foreground-500" />
                <span>
                  {formatTime(event.startTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </span>
              </div>
            )}
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
