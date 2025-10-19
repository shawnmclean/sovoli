import type { Event } from "~/modules/events/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Link } from "@sovoli/ui/components/link";
import { Badge } from "@sovoli/ui/components/badge";
import { Button } from "@sovoli/ui/components/button";
import { Image } from "@sovoli/ui/components/image";
import { ArrowRightIcon } from "lucide-react";

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
      year: "numeric",
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
    <Card className="overflow-hidden shadow-md transition hover:shadow-lg">
      {/* Event Image */}
      <div className="relative">
        <Image
          src={event.photos?.[0]?.url ?? ""}
          alt={event.name}
          width={800}
          height={225}
          className="h-52 w-full object-cover"
        />

        {/* Popular Badge */}
        {event.isPopular && (
          <div className="absolute top-3 right-3 z-20">
            <Badge color="warning" variant="flat" size="sm">
              🔥 Popular
            </Badge>
          </div>
        )}
      </div>

      <CardBody className="flex flex-col space-y-3">
        {/* Event Title + Description */}
        <div>
          <h3 className="text-xl font-semibold text-primary-800">
            {event.name}
          </h3>
          <p className="text-base leading-relaxed text-foreground-600">
            {event.description ?? "Join us for this exciting event!"}
          </p>
        </div>

        {/* Event Details */}
        <div className="space-y-2">
          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-foreground-500" />
            <Chip color="default" variant="dot">
              {formatDate(event.startDate)}
            </Chip>
          </div>

          {/* Time */}
          {event.startTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-foreground-500" />
              <Chip color="default" variant="dot">
                {formatTime(event.startTime)}
                {event.endTime && ` - ${formatTime(event.endTime)}`}
              </Chip>
            </div>
          )}

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-foreground-500" />
              <Chip color="default" variant="dot">
                {event.location}
              </Chip>
            </div>
          )}
        </div>

        {/* Event Highlights */}
        {event.highlights && event.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.highlights.slice(0, 3).map((highlight, index) => (
              <Chip key={index} color="default" variant="flat" size="sm">
                {highlight.label}
              </Chip>
            ))}
            {event.highlights.length > 3 && (
              <Chip color="default" variant="flat" size="sm">
                +{event.highlights.length - 3} more
              </Chip>
            )}
          </div>
        )}

        {/* Event Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag, index) => (
              <Chip key={index} color="primary" variant="flat" size="sm">
                #{tag}
              </Chip>
            ))}
            {event.tags.length > 3 && (
              <Chip color="default" variant="flat" size="sm">
                +{event.tags.length - 3} more
              </Chip>
            )}
          </div>
        )}
      </CardBody>

      {/* Footer */}
      <CardFooter className="flex flex-col items-center gap-3 pt-4">
        <Button
          as={Link}
          href={`/events/${event.slug}`}
          fullWidth
          color="primary"
          variant="solid"
          radius="md"
          size="lg"
          startContent={<ArrowRightIcon className="w-5 h-5" />}
        >
          View Details
        </Button>

        <p className="text-xs text-foreground-500 text-center">
          📅 Event Details &middot; 🎯 Activities &middot; 📍 Location
        </p>
      </CardFooter>
    </Card>
  );
}
