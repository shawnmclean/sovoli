import type { Event } from "~/modules/events/types";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";
import { format, parseISO } from "date-fns";
import { Calendar, MapPin, Clock } from "lucide-react";

interface EventHeroSectionProps {
  orgInstance: OrgInstanceWithWebsite;
  event: Event;
}

export function EventHeroSection({
  orgInstance,
  event,
}: EventHeroSectionProps) {
  const startDate = parseISO(event.startDate);
  const endDate = event.endDate ? parseISO(event.endDate) : null;

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
        {event.tagline && (
          <p className="text-lg text-gray-600 mb-4">{event.tagline}</p>
        )}
        {event.description && (
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center space-x-2 text-gray-700">
          <Calendar className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium">
              {format(startDate, "EEEE, MMMM do, yyyy")}
            </p>
            {endDate && endDate.getTime() !== startDate.getTime() && (
              <p className="text-sm text-gray-500">
                to {format(endDate, "EEEE, MMMM do, yyyy")}
              </p>
            )}
          </div>
        </div>

        {event.time && (
          <div className="flex items-center space-x-2 text-gray-700">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">{event.time}</p>
            </div>
          </div>
        )}

        {event.location && (
          <div className="flex items-center space-x-2 text-gray-700">
            <MapPin className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium">{event.location}</p>
            </div>
          </div>
        )}
      </div>

      {event.photos && event.photos.length > 0 && (
        <div className="mb-6">
          <img
            src={event.photos[0].url}
            alt={event.name}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
}
