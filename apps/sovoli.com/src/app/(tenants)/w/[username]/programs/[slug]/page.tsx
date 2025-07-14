import { notFound } from "next/navigation";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Badge } from "@sovoli/ui/components/badge";
import { Chip } from "@sovoli/ui/components/chip";
import { Link } from "@sovoli/ui/components/link";

import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  StarIcon,
  UsersIcon,
  BookOpenIcon,
  GraduationCapIcon,
} from "lucide-react";
import { parseISO } from "date-fns";

import { ProgramPriceCard } from "../../(main-layout)/programs/components/ProgramPriceCard";
import { displayAgeRange } from "../../(main-layout)/programs/utils";
import { getOrgInstanceWithProgram } from "./lib/getOrgInstanceWithProgram";
import { ProgramGalleryCarousel } from "./components/ProgramGalleryCarousel";
import { ProgramHero } from "./components/ProgramHero";

const retreiveOrgInstanceWithProgram = async (
  username: string,
  slug: string,
) => {
  const result = await getOrgInstanceWithProgram(username, slug);
  if (!result) return notFound();
  return result;
};
interface ProgramDetailsPageProps {
  params: Promise<{ username: string; slug: string }>;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  const now = new Date();
  const isThisYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString("en-GY", {
    year: isThisYear ? undefined : "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function to format date range compactly
const formatDateRange = (startDate: string, endDate: string) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const now = new Date();
  const isSameDay = start.getTime() === end.getTime();
  const isSameYear = start.getFullYear() === end.getFullYear();
  const isThisYear =
    start.getFullYear() === now.getFullYear() &&
    end.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return formatDate(startDate);
  }

  // If both dates are in the same year and it's this year, omit the year from both
  if (isSameYear && isThisYear) {
    return `${start.toLocaleDateString("en-GY", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-GY", { month: "short", day: "numeric" })}`;
  }

  // If both dates are in the same year but not this year, show year only on end
  if (isSameYear) {
    return `${start.toLocaleDateString("en-GY", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-GY", { month: "short", day: "numeric", year: "numeric" })}`;
  }

  // If years are different, show full date for both
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
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

export default async function ProgramDetailsPage({
  params,
}: ProgramDetailsPageProps) {
  const { username, slug } = await params;

  const { orgInstance, program } = await retreiveOrgInstanceWithProgram(
    username,
    slug,
  );

  // Get cycles for this program
  const programCycles =
    orgInstance.academicModule?.programCycles?.filter(
      (cycle) => cycle.orgProgram.slug === program.slug,
    ) ?? [];

  // Get all future cycles (including next)
  const futureCycles = programCycles
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
    });

  // Get the next upcoming cycle (first future cycle)
  const nextCycle = futureCycles[0];

  // Get the current cycle
  const currentCycle = programCycles.find((cycle) => {
    const startDate =
      cycle.academicCycle.startDate ??
      cycle.academicCycle.globalCycle?.startDate;
    const endDate =
      cycle.academicCycle.endDate ?? cycle.academicCycle.globalCycle?.endDate;
    if (!startDate || !endDate) return false;
    return getCycleStatus(startDate, endDate) === "current";
  });

  // Get organization contact info

  return (
    <>
      <ProgramGalleryCarousel program={program} />
      <ProgramHero orgInstance={orgInstance} program={program} />

      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Program Highlights */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
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
                        Comprehensive curriculum designed to foster critical
                        thinking and creativity
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
                        Personalized attention with optimal teacher-student
                        ratios
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

            {/* Academic Cycles */}
            {programCycles.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                    Term Information
                  </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  {currentCycle && (
                    <div className="rounded-lg bg-primary-50 border border-primary-200 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge color="primary" variant="flat" size="sm">
                          Current
                        </Badge>
                        <span className="text-sm font-medium text-primary-900">
                          {currentCycle.academicCycle.customLabel ??
                            currentCycle.academicCycle.globalCycle?.label ??
                            "Current Cycle"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-foreground-600">
                            Date:
                          </span>
                          <span className="font-medium text-foreground">
                            {formatDateRange(
                              currentCycle.academicCycle.startDate ??
                                currentCycle.academicCycle.globalCycle
                                  ?.startDate ??
                                "",
                              currentCycle.academicCycle.endDate ??
                                currentCycle.academicCycle.globalCycle
                                  ?.endDate ??
                                "",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {futureCycles.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        Upcoming Cycles
                      </h3>
                      {futureCycles.map((cycle, index) => (
                        <div
                          key={cycle.id}
                          className={`rounded-lg border p-4 ${
                            index === 0
                              ? "bg-success-50 border-success-200"
                              : "bg-default-50 border-default-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Badge
                              color={index === 0 ? "success" : "secondary"}
                              variant="flat"
                              size="sm"
                            >
                              {index === 0 ? "Next" : `Cycle ${index + 1}`}
                            </Badge>
                            <span className="text-sm font-medium text-foreground">
                              {cycle.academicCycle.customLabel ??
                                cycle.academicCycle.globalCycle?.label ??
                                "Upcoming Cycle"}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-foreground-600">
                                Date:
                              </span>
                              <span className="font-medium text-foreground">
                                {formatDateRange(
                                  cycle.academicCycle.startDate ??
                                    cycle.academicCycle.globalCycle
                                      ?.startDate ??
                                    "",
                                  cycle.academicCycle.endDate ??
                                    cycle.academicCycle.globalCycle?.endDate ??
                                    "",
                                )}
                              </span>
                            </div>

                            {cycle.registrationPeriod && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground-600">
                                  Registration:
                                </span>
                                <span className="font-medium text-foreground">
                                  {formatDateRange(
                                    cycle.registrationPeriod.startDate,
                                    cycle.registrationPeriod.endDate,
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Requirements */}
            {((program.requirements?.length ?? 0) > 0 ||
              (program.standardProgramVersion?.requirements?.length ?? 0) >
                0) && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <UserIcon className="h-6 w-6 text-primary" />
                    Requirements
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {(
                      program.requirements ??
                      program.standardProgramVersion?.requirements ??
                      []
                    ).map((requirement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-default-50 rounded-lg"
                      >
                        <Chip color="secondary" variant="flat" size="sm">
                          {requirement.type === "age" ? "Age" : "Document"}
                        </Chip>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground mb-1">
                            {requirement.description ?? requirement.name}
                          </p>
                          {requirement.type === "age" &&
                            requirement.ageRange && (
                              <p className="text-xs text-foreground-500">
                                {displayAgeRange(requirement.ageRange)}
                              </p>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Curriculum */}
            {(program.levels ?? program.standardProgramVersion?.levels ?? [])
              .length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <BookOpenIcon className="h-6 w-6 text-primary" />
                    Curriculum Overview
                  </h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  {(
                    program.levels ??
                    program.standardProgramVersion?.levels ??
                    []
                  ).map((level, levelIndex) => (
                    <div key={level.id} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {levelIndex + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {level.label}
                          </h3>
                          {level.ageRange && (
                            <p className="text-sm text-foreground-600 mt-1">
                              Ages {level.ageRange.min}-{level.ageRange.max}{" "}
                              years
                            </p>
                          )}
                        </div>
                      </div>

                      {level.courses && level.courses.length > 0 && (
                        <div className="ml-8 sm:ml-11 space-y-2 sm:space-y-3">
                          {level.courses.map((course) => (
                            <div
                              key={course.id}
                              className="p-3 sm:p-4 bg-default-50 rounded-lg border border-default-200"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Chip
                                    color="secondary"
                                    variant="flat"
                                    size="sm"
                                  >
                                    {course.subject.name}
                                  </Chip>
                                </div>
                                <h4 className="font-semibold text-foreground mb-2">
                                  {course.title}
                                </h4>
                                {course.description && (
                                  <p className="text-sm text-foreground-600 mb-3">
                                    {course.description}
                                  </p>
                                )}
                                {course.units && course.units.length > 0 && (
                                  <div className="space-y-2 sm:space-y-3">
                                    <p className="text-xs font-medium text-foreground-500 uppercase tracking-wide">
                                      Course Units
                                    </p>
                                    <div className="space-y-2">
                                      {course.units.map((unit, unitIndex) => (
                                        <div
                                          key={unitIndex}
                                          className="bg-default-100 rounded-lg p-2 sm:p-3"
                                        >
                                          <h5 className="font-medium text-foreground text-sm mb-2">
                                            {unitIndex + 1}. {unit.title}
                                          </h5>
                                          {unit.topics.length > 0 && (
                                            <ul className="space-y-1">
                                              {unit.topics.map(
                                                (topic, topicIndex) => (
                                                  <li
                                                    key={topicIndex}
                                                    className="text-sm text-foreground-600 flex items-start gap-2"
                                                  >
                                                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                                                    {topic}
                                                  </li>
                                                ),
                                              )}
                                            </ul>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardBody>
              </Card>
            )}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-bold text-foreground">
                  Your Teachers
                </h2>
              </CardHeader>
              <CardBody>
                <div className="prose prose-sm max-w-none text-foreground-700">
                  Teachers for this program will be added soon.
                  <Link href={`/workforce/people`}>
                    View all our staff here
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <h3 className="text-xl font-bold text-foreground">
                  Your School
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                Facilities and other information coming soon.
              </CardBody>
            </Card>
          </div>

          {/* Pricing Information */}
          {programCycles.length > 0 && (
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  Pricing & Fees
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {nextCycle && (
                  <div className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                      {nextCycle.pricingPackage.pricingItems
                        .filter((item) => item.purpose === "tuition")
                        .map((item) => (
                          <div key={item.id} className="space-y-2">
                            <ProgramPriceCard
                              pricingPackage={nextCycle.pricingPackage}
                              pricingItemId={item.id}
                            />
                          </div>
                        ))}

                      {nextCycle.pricingPackage.pricingItems
                        .filter((item) => item.purpose === "registration")
                        .map((item) => (
                          <div key={item.id} className="space-y-2">
                            <ProgramPriceCard
                              pricingPackage={nextCycle.pricingPackage}
                              pricingItemId={item.id}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {currentCycle && (
                  <div className="space-y-4 pt-6 border-t border-default-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge color="primary" variant="flat" size="sm">
                        Current Cycle Pricing
                      </Badge>
                      <span className="text-sm font-medium text-primary-900">
                        {currentCycle.academicCycle.customLabel ??
                          currentCycle.academicCycle.globalCycle?.label ??
                          "Current Cycle"}
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {currentCycle.pricingPackage.pricingItems
                        .filter((item) => item.purpose === "registration")
                        .map((item) => (
                          <div key={item.id} className="space-y-2">
                            <h4 className="font-semibold text-foreground">
                              Registration Fee
                            </h4>
                            <ProgramPriceCard
                              pricingPackage={currentCycle.pricingPackage}
                              pricingItemId={item.id}
                            />
                          </div>
                        ))}

                      {currentCycle.pricingPackage.pricingItems
                        .filter((item) => item.purpose === "tuition")
                        .map((item) => (
                          <div key={item.id} className="space-y-2">
                            <h4 className="font-semibold text-foreground">
                              Tuition Fee
                            </h4>
                            <ProgramPriceCard
                              pricingPackage={currentCycle.pricingPackage}
                              pricingItemId={item.id}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
