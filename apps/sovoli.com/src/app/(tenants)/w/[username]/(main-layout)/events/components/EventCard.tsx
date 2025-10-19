import type { Event } from "~/modules/events/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { Image } from "@sovoli/ui/components/image";
import { Badge } from "@sovoli/ui/components/badge";
import { Calendar } from "lucide-react";

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

  return (
    <Card
      as={Link}
      href={`/events/${event.slug}`}
      className="overflow-hidden shadow-md transition hover:shadow-lg"
    >
      {/* Event Image */}
      <div className="relative w-full">
        <Image
          src={event.photos?.[0]?.url ?? ""}
          alt={event.name}
          width={800}
          height={150}
          className="h-52 w-full object-cover block"
        />
      </div>

      <CardBody className="flex flex-col space-y-3">
        {/* Event Title */}
        <h3 className="text-xl font-semibold text-primary-800">{event.name}</h3>

        {/* Date */}
        <span className="text-sm text-foreground-600">
          {formatDate(event.startDate)}
        </span>
      </CardBody>
    </Card>
  );
}
