import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { GetAllWebsiteUsernamesQuery } from "~/modules/websites/services/queries/GetAllWebsiteUsernames";
import { bus } from "~/services/core/bus";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Badge } from "@sovoli/ui/components/badge";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import { parseISO } from "date-fns";

const retreiveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return date.toLocaleDateString("en-GY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to get current date
const getCurrentDate = () => new Date();

// Helper function to check if date is in the future
const isDateInFuture = (dateString: string) => {
  const date = parseISO(dateString);
  return date > getCurrentDate();
};

// Helper function to get cycle status
const getCycleStatus = (startDate: string, endDate: string) => {
  const now = getCurrentDate();
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "current";
  return "completed";
};

// Helper function to display age range
const displayAgeRange = (ageRange: {
  minAgeYears?: number;
  maxAgeYears?: number;
  minAgeMonths?: number;
  maxAgeMonths?: number;
}) => {
  const parts = [];

  if (ageRange.minAgeYears || ageRange.minAgeMonths) {
    const minAge = [];
    if (ageRange.minAgeYears)
      minAge.push(
        `${ageRange.minAgeYears} year${ageRange.minAgeYears !== 1 ? "s" : ""}`,
      );
    if (ageRange.minAgeMonths)
      minAge.push(
        `${ageRange.minAgeMonths} month${ageRange.minAgeMonths !== 1 ? "s" : ""}`,
      );
    parts.push(`Min: ${minAge.join(" ")}`);
  }

  if (ageRange.maxAgeYears || ageRange.maxAgeMonths) {
    const maxAge = [];
    if (ageRange.maxAgeYears)
      maxAge.push(
        `${ageRange.maxAgeYears} year${ageRange.maxAgeYears !== 1 ? "s" : ""}`,
      );
    if (ageRange.maxAgeMonths)
      maxAge.push(
        `${ageRange.maxAgeMonths} month${ageRange.maxAgeMonths !== 1 ? "s" : ""}`,
      );
    parts.push(`Max: ${maxAge.join(" ")}`);
  }

  return parts.join(", ");
};

export async function generateStaticParams() {
  //TODO: change query to get all org usernames
  const result = await bus.queryProcessor.execute(
    new GetAllWebsiteUsernamesQuery(),
  );
  return result.usernames.map((username) => ({
    username,
  }));
}

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);
  const programs = orgInstance.academicModule?.programs ?? [];
  const programCycles = orgInstance.academicModule?.programCycles ?? [];

  return (
    <div className="min-h-screen bg-default-50">
      {/* Header */}
      <div className="bg-background shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Our Programs
          </h1>
          <p className="mt-2 text-lg text-foreground-600">
            Discover our comprehensive educational offerings designed to nurture
            and develop your child's potential.
          </p>
        </div>
      </div>

      {/* Programs List */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-6">
          {programs.map((program, index) => {
            // Find cycles for this program
            const programCyclesForProgram = programCycles.filter(
              (cycle) => cycle.orgProgram.slug === program.slug,
            );

            // Get the next upcoming cycle
            const nextCycle = programCyclesForProgram
              .filter((cycle) => {
                const startDate =
                  cycle.academicCycle.startDate ??
                  cycle.academicCycle.globalCycle?.startDate;
                return startDate && isDateInFuture(startDate);
              })
              .sort((a, b) => {
                const aStart =
                  a.academicCycle.startDate ??
                  a.academicCycle.globalCycle?.startDate ??
                  "";
                const bStart =
                  b.academicCycle.startDate ??
                  b.academicCycle.globalCycle?.startDate ??
                  "";
                return parseISO(aStart).getTime() - parseISO(bStart).getTime();
              })[0];

            // Get the current cycle
            const currentCycle = programCyclesForProgram.find((cycle) => {
              const startDate =
                cycle.academicCycle.startDate ??
                cycle.academicCycle.globalCycle?.startDate;
              const endDate =
                cycle.academicCycle.endDate ??
                cycle.academicCycle.globalCycle?.endDate;
              if (!startDate || !endDate) return false;
              return getCycleStatus(startDate, endDate) === "current";
            });

            const programName =
              program.name ??
              program.standardProgramVersion?.program.name ??
              "Program";
            const programDescription =
              program.description ??
              program.standardProgramVersion?.program.description ??
              "";
            const programImage =
              program.image ??
              program.standardProgramVersion?.program.image ??
              "/orgs/defaults/programs/nursery.webp";

            return (
              <Card key={index} className="overflow-hidden shadow-lg">
                <div className="md:flex">
                  {/* Program Image */}
                  <div className="md:w-1/3">
                    <div className="relative h-48 w-full md:h-full">
                      <Image
                        src={programImage}
                        alt={programName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Program Content */}
                  <div className="flex-1 p-6">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">
                            {programName}
                          </h2>
                          <p className="mt-2 text-foreground-600">
                            {programDescription}
                          </p>
                        </div>
                        <Badge
                          color={nextCycle ? "success" : "default"}
                          variant="flat"
                        >
                          {nextCycle ? "Enrolling" : "Full"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardBody className="space-y-6">
                      {/* Cycle Information */}
                      <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                          Academic Cycles
                        </h3>

                        {nextCycle && (
                          <div className="rounded-lg bg-primary-50 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge color="primary" variant="flat" size="sm">
                                Next Cycle
                              </Badge>
                              <span className="text-sm font-medium text-primary-900">
                                {nextCycle.academicCycle.customLabel ??
                                  nextCycle.academicCycle.globalCycle?.label ??
                                  "Upcoming Cycle"}
                              </span>
                            </div>
                            <div className="grid gap-2 text-sm sm:grid-cols-2">
                              <div>
                                <p className="text-foreground-600">
                                  Start Date
                                </p>
                                <p className="font-medium text-foreground">
                                  {formatDate(
                                    nextCycle.academicCycle.startDate ??
                                      nextCycle.academicCycle.globalCycle
                                        ?.startDate ??
                                      "",
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-foreground-600">End Date</p>
                                <p className="font-medium text-foreground">
                                  {formatDate(
                                    nextCycle.academicCycle.endDate ??
                                      nextCycle.academicCycle.globalCycle
                                        ?.endDate ??
                                      "",
                                  )}
                                </p>
                              </div>
                            </div>

                            {nextCycle.registrationPeriod && (
                              <div className="mt-3 pt-3 border-t border-primary-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <ClockIcon className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium text-primary-900">
                                    Registration Period
                                  </span>
                                </div>
                                <div className="grid gap-2 text-sm sm:grid-cols-2">
                                  <div>
                                    <p className="text-foreground-600">Opens</p>
                                    <p className="font-medium text-foreground">
                                      {formatDate(
                                        nextCycle.registrationPeriod.startDate,
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-foreground-600">
                                      Closes
                                    </p>
                                    <p className="font-medium text-foreground">
                                      {formatDate(
                                        nextCycle.registrationPeriod.endDate,
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {currentCycle && (
                          <div className="rounded-lg bg-success-50 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge color="success" variant="flat" size="sm">
                                Current Cycle
                              </Badge>
                              <span className="text-sm font-medium text-success-900">
                                {currentCycle.academicCycle.customLabel ??
                                  currentCycle.academicCycle.globalCycle
                                    ?.label ??
                                  "Current Cycle"}
                              </span>
                            </div>
                            <div className="grid gap-2 text-sm sm:grid-cols-2">
                              <div>
                                <p className="text-foreground-600">
                                  Start Date
                                </p>
                                <p className="font-medium text-foreground">
                                  {formatDate(
                                    currentCycle.academicCycle.startDate ??
                                      currentCycle.academicCycle.globalCycle
                                        ?.startDate ??
                                      "",
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-foreground-600">End Date</p>
                                <p className="font-medium text-foreground">
                                  {formatDate(
                                    currentCycle.academicCycle.endDate ??
                                      currentCycle.academicCycle.globalCycle
                                        ?.endDate ??
                                      "",
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Requirements */}
                      {((program.requirements?.length ?? 0) > 0 ||
                        (program.standardProgramVersion?.requirements?.length ??
                          0) > 0) && (
                        <div className="space-y-3">
                          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                            <UserIcon className="h-5 w-5 text-secondary" />
                            Requirements
                          </h3>
                          <div className="space-y-2">
                            {(
                              program.requirements ??
                              program.standardProgramVersion?.requirements ??
                              []
                            ).map((requirement, reqIndex) => (
                              <div
                                key={reqIndex}
                                className="flex items-center gap-2"
                              >
                                <Chip
                                  color="secondary"
                                  variant="flat"
                                  size="sm"
                                >
                                  {requirement.type === "age"
                                    ? "Age"
                                    : "Document"}
                                </Chip>
                                <span className="text-sm text-foreground-700">
                                  {requirement.description ?? requirement.name}
                                  {requirement.type === "age" &&
                                    requirement.ageRange && (
                                      <span className="text-foreground-500 ml-1">
                                        ({displayAgeRange(requirement.ageRange)}
                                        )
                                      </span>
                                    )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button
                          color="primary"
                          variant="solid"
                          className="flex-1"
                        >
                          Learn More
                        </Button>
                        {nextCycle && (
                          <Button
                            color="success"
                            variant="bordered"
                            className="flex-1"
                          >
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </CardBody>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {programs.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Programs Available
              </h3>
              <p className="text-foreground-600">
                We're currently updating our program offerings. Please check
                back soon or contact us for more information.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
