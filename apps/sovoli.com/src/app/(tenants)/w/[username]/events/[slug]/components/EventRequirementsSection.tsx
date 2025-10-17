import type { Event } from "~/modules/events/types";
import {
  CheckCircle,
  AlertCircle,
  Package,
  Shirt,
  Wrench,
  Info,
} from "lucide-react";

interface EventRequirementsSectionProps {
  event: Event;
}

const requirementIconMap = {
  bring: Package,
  wear: Shirt,
  prepare: Wrench,
  other: Info,
};

const requirementColorMap = {
  bring: "text-green-600",
  wear: "text-blue-600",
  prepare: "text-orange-600",
  other: "text-gray-600",
};

export function EventRequirementsSection({
  event,
}: EventRequirementsSectionProps) {
  if (!event.requirements || event.requirements.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Event Requirements
      </h2>

      <div className="space-y-4">
        {event.requirements.map((requirement, index) => {
          const IconComponent = requirementIconMap[requirement.type] || Info;
          const iconColor =
            requirementColorMap[requirement.type] || "text-gray-600";

          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <IconComponent className={`h-5 w-5 ${iconColor} mt-1`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {requirement.name}
                    </h3>
                    {requirement.isRequired ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Optional
                      </span>
                    )}
                  </div>

                  {requirement.description && (
                    <p className="text-gray-700 mb-2">
                      {requirement.description}
                    </p>
                  )}

                  {requirement.quantity && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Quantity:</strong> {requirement.quantity}
                    </p>
                  )}

                  {requirement.notes && (
                    <p className="text-sm text-gray-600 italic">
                      {requirement.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
