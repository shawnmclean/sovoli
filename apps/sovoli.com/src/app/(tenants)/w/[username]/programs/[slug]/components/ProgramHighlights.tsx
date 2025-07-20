import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import {
  StarIcon,
  GraduationCapIcon,
  UsersIcon,
  BookOpenIcon,
  ClockIcon,
} from "lucide-react";

export function ProgramHighlights() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <StarIcon className="h-6 w-6 text-primary" />
          Program Highlights
        </h2>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <GraduationCapIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Academic Excellence
              </h3>
              <p className="text-sm text-foreground-600">
                Comprehensive curriculum designed to foster critical thinking
                and creativity
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Small Class Sizes
              </h3>
              <p className="text-sm text-foreground-600">
                Personalized attention with optimal teacher-student ratios
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <BookOpenIcon className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Modern Resources
              </h3>
              <p className="text-sm text-foreground-600">
                State-of-the-art facilities and learning materials
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Flexible Scheduling
              </h3>
              <p className="text-sm text-foreground-600">
                Multiple cycles and convenient registration periods
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
