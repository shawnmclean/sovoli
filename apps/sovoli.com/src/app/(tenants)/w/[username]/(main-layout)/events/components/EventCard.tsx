import type { Event } from "~/modules/events/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Image } from "@sovoli/ui/components/image";

interface EventCardProps {
  event: Event;
  orgInstance: OrgInstance;
}

export function EventCard({ event, orgInstance }: EventCardProps) {
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "upcoming":
        return "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary";
      case "current":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "completed":
        return "bg-muted text-muted-foreground";
      case "cancelled":
        return "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border">
      {/* Event Image */}
      {event.photos && event.photos.length > 0 && event.photos[0] && (
        <div className="aspect-video overflow-hidden">
          <Image
            src={event.photos[0].url}
            alt={event.name}
            width={400}
            height={225}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Event Status and Category */}
        <div className="flex items-center justify-between mb-3">
          {event.status && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                event.status,
              )}`}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          )}
          {event.category && (
            <span className="text-sm text-muted-foreground">
              {event.category.name}
            </span>
          )}
        </div>

        {/* Event Title */}
        <h3 className="text-xl font-semibold mb-2">{event.name}</h3>

        {/* Event Description */}
        {event.description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {event.description}
          </p>
        )}

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          {/* Date */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(event.startDate)}</span>
          </div>

          {/* Time */}
          {event.startTime && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                {formatTime(event.startTime)}
                {event.endTime && ` - ${formatTime(event.endTime)}`}
              </span>
            </div>
          )}

          {/* Location */}
          {event.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {/* Event Highlights */}
        {event.highlights && event.highlights.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Users className="w-4 h-4 mr-2" />
              <span className="font-medium">Highlights</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {event.highlights.slice(0, 3).map((highlight, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
                >
                  {highlight.label}
                </span>
              ))}
              {event.highlights.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{event.highlights.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Event Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary"
                >
                  #{tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{event.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Details Link */}
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View Details
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
