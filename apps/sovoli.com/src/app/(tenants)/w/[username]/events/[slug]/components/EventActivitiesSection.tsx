import type { Event } from "~/modules/events/types";
import { Clock, List } from "lucide-react";

interface EventActivitiesSectionProps {
  event: Event;
}

export function EventActivitiesSection({ event }: EventActivitiesSectionProps) {
  if (!event.activities || event.activities.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Event Activities
      </h2>

      <div className="space-y-6">
        {event.activities.map((activity, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start space-x-3 mb-3">
              <List className="h-5 w-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {activity.title}
                </h3>
                {activity.duration && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{activity.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {activity.description && (
              <p className="text-gray-700 mb-4">{activity.description}</p>
            )}

            {activity.materials && activity.materials.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Materials Needed:
                </h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {activity.materials.map((material, materialIndex) => (
                    <li key={materialIndex}>{material}</li>
                  ))}
                </ul>
              </div>
            )}

            {activity.instructions && activity.instructions.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Instructions:
                </h4>
                <ol className="list-decimal list-inside text-gray-700 space-y-1">
                  {activity.instructions.map(
                    (instruction, instructionIndex) => (
                      <li key={instructionIndex}>{instruction}</li>
                    ),
                  )}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
