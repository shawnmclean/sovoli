import type { Event } from "~/modules/events/types";

interface EventGallerySectionProps {
  event: Event;
}

export function EventGallerySection({ event }: EventGallerySectionProps) {
  if (!event.photos || event.photos.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {event.photos.map((photo, index) => (
          <div key={index} className="relative group">
            <img
              src={photo.url}
              alt={photo.alt || event.name}
              className="w-full h-64 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
            />
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 rounded-b-lg">
                <p className="text-sm">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
