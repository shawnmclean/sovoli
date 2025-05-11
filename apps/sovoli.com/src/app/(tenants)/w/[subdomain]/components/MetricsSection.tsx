import { Card, CardBody } from "@sovoli/ui/components/card";
import {
  AwardIcon,
  CalendarIcon,
  CheckCircleIcon,
  GraduationCapIcon,
  LayersIcon,
  UsersIcon,
} from "lucide-react";

export function MetricsSection() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Our School Metrics
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <Card className="border-none" shadow="sm">
            <CardBody className="p-6 text-center">
              <CheckCircleIcon className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-3 text-xl font-semibold">Pass Rate</h3>
              <p className="text-default-600">
                95% of our students successfully pass their exams.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none" shadow="sm">
            <CardBody className="p-6 text-center">
              <UsersIcon className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-3 text-xl font-semibold">
                Student-Teacher Ratio
              </h3>
              <p className="text-default-600">
                Maintained at 15:1 for personalized attention.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none" shadow="sm">
            <CardBody className="p-6 text-center">
              <LayersIcon className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-3 text-xl font-semibold">Average Class Size</h3>
              <p className="text-default-600">
                Small classes with an average of 20 students.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none" shadow="sm">
            <CardBody className="p-6 text-center">
              <AwardIcon className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-3 text-xl font-semibold">
                Teacher Qualification
              </h3>
              <p className="text-default-600">
                85% of our teachers hold a Bachelor's degree or higher.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none" shadow="sm">
            <CardBody className="p-6 text-center">
              <GraduationCapIcon className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-3 text-xl font-semibold">School Placement</h3>
              <p className="text-default-600">
                90% of our graduates enter top high schools.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none" shadow="sm">
            <CardBody className="p-6 text-center">
              <CalendarIcon className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-3 text-xl font-semibold">Attendance Rate</h3>
              <p className="text-default-600">
                Students maintain a 95% average attendance rate.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none" shadow="sm">
            <CardBody className="p-6 text-center">
              <LayersIcon className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-3 text-xl font-semibold">Average Class Size</h3>
              <p className="text-default-600">
                20 studends per class for optimal learning.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none" shadow="sm">
            <CardBody className="p-6 text-center">
              <GraduationCapIcon className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-3 text-xl font-semibold">Attendance Rate</h3>
              <p className="text-default-600">
                Students maintain a 95% average attendance rate.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
