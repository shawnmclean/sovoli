import { Card, CardBody } from "@sovoli/ui/components/card";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import {
  AwardIcon,
  CalendarIcon,
  CheckCircleIcon,
  GraduationCapIcon,
  InfoIcon,
  LayersIcon,
  UsersIcon,
} from "lucide-react";

import type { PageSection } from "~/modules/website/types";

export interface MetricsProps {
  section: PageSection;
}
const metricsData = [
  {
    icon: <CheckCircleIcon className="h-6 w-6 text-primary" />,
    title: "Pass Rate",
    value: "95%",
    description: "Students successfully passing their exams",
  },
  {
    icon: <UsersIcon className="h-6 w-6 text-primary" />,
    title: "Student-Teacher Ratio",
    value: "15:1",
    description: "Maintained for personalized attention",
  },
  {
    icon: <LayersIcon className="h-6 w-6 text-primary" />,
    title: "Average Class Size",
    value: "20",
    description: "Small classes for optimal learning",
  },
  {
    icon: <AwardIcon className="h-6 w-6 text-primary" />,
    title: "Teacher Qualification",
    value: "85%",
    description: "Teachers with Bachelor's degree or higher",
  },
  {
    icon: <GraduationCapIcon className="h-6 w-6 text-primary" />,
    title: "School Placement",
    value: "90%",
    description: "Graduates entering top high schools",
  },
  {
    icon: <CalendarIcon className="h-6 w-6 text-primary" />,
    title: "Attendance Rate",
    value: "95%",
    description: "Average student attendance rate",
  },
];

export function Metrics({ section }: MetricsProps) {
  return (
    <section className="px-4 pt-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {metricsData.map((metric, index) => (
            <Card
              key={index}
              className="overflow-visible border-none"
              shadow="sm"
            >
              <CardBody className="flex items-center gap-2 p-3">
                <div className="rounded-full bg-content1 p-1.5">
                  {metric.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-foreground-600">
                      {metric.title}
                    </h3>
                    <Tooltip content={metric.description} placement="top">
                      <InfoIcon className="h-3 w-3 cursor-help text-foreground-400" />
                    </Tooltip>
                  </div>
                  <p className="font-semibold">{metric.value}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
