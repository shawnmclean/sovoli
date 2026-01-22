import { Info, Package, Shirt, Wrench } from "lucide-react";
import type { Event } from "~/modules/events/types";

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
  bring: "text-success",
  wear: "text-primary",
  prepare: "text-warning",
  other: "text-muted-foreground",
};

export function EventRequirementsSection({
  event,
}: EventRequirementsSectionProps) {
  if (!event.requirements || event.requirements.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Requirements</h2>

      <div className="space-y-4">
        {event.requirements.map((requirement, index) => {
          const IconComponent = requirementIconMap[requirement.type];
          const iconColor =
            requirementColorMap[requirement.type] || "text-muted-foreground";

          return (
            <div key={index} className="bg-content2 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <IconComponent className={`h-5 w-5 ${iconColor} mt-1`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-foreground">
                      {requirement.name}
                    </h3>
                    {requirement.isRequired ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-danger/10 text-danger">
                        Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-content3 text-foreground/60">
                        Optional
                      </span>
                    )}
                  </div>

                  {requirement.description && (
                    <p className="text-foreground/80 mb-2">
                      {requirement.description}
                    </p>
                  )}

                  {requirement.quantity && (
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Quantity:</strong> {requirement.quantity}
                    </p>
                  )}

                  {requirement.notes && (
                    <p className="text-sm text-muted-foreground italic">
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
