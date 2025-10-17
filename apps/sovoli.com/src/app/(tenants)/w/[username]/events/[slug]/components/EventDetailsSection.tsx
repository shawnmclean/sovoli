import type { Event } from "~/modules/events/types";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";

interface EventDetailsSectionProps {
  event: Event;
}

export function EventDetailsSection({ event }: EventDetailsSectionProps) {
  const startDate = parseISO(event.startDate);
  const endDate = event.endDate ? parseISO(event.endDate) : null;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Date</h3>
            <p className="text-gray-700">
              {format(startDate, "EEEE, MMMM do, yyyy")}
              {endDate && endDate.getTime() !== startDate.getTime() && (
                <span> - {format(endDate, "EEEE, MMMM do, yyyy")}</span>
              )}
            </p>
          </div>
        </div>

        {event.time && (
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-green-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Time</h3>
              <p className="text-gray-700">{event.time}</p>
            </div>
          </div>
        )}

        {event.location && (
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-red-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Location</h3>
              <p className="text-gray-700">{event.location}</p>
            </div>
          </div>
        )}

        {event.tags && event.tags.length > 0 && (
          <div className="flex items-start space-x-3">
            <Tag className="h-5 w-5 text-purple-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Tags</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {event.notes && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Additional Notes
            </h3>
            <p className="text-gray-700">{event.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
