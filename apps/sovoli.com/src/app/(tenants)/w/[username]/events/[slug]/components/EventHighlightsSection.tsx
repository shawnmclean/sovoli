import type { Event } from "~/modules/events/types";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Gift,
  Palette,
  Music,
  Camera,
  Heart,
  Trophy,
  BookOpen,
  Smile,
  Clock,
  ShieldCheck,
  Home,
  Sun,
  Moon,
  Bell,
  MessageCircle,
} from "lucide-react";

interface EventHighlightsSectionProps {
  event: Event;
}

const iconMap = {
  calendar: Calendar,
  "map-pin": MapPin,
  users: Users,
  star: Star,
  gift: Gift,
  palette: Palette,
  music: Music,
  camera: Camera,
  heart: Heart,
  trophy: Trophy,
  "book-open": BookOpen,
  smile: Smile,
  clock: Clock,
  "shield-check": ShieldCheck,
  home: Home,
  sun: Sun,
  moon: Moon,
  bell: Bell,
  "message-circle": MessageCircle,
};

export function EventHighlightsSection({ event }: EventHighlightsSectionProps) {
  if (!event.highlights || event.highlights.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Event Highlights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {event.highlights.map((highlight, index) => {
          const IconComponent = iconMap[highlight.icon];

          return (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
            >
              <IconComponent className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {highlight.label}
                </h3>
                <p className="text-gray-600 text-sm">{highlight.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
