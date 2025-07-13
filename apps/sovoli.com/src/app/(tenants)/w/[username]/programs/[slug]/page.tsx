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

  // Get the next upcoming cycle
  const nextCycle = programCycles
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
                <CardBody className="space-y-6">
                  {nextCycle && (
                    <div className="rounded-lg bg-success-50 border border-success-200 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge color="success" variant="flat" size="sm">
                          Next Cycle
                        </Badge>
                        <span className="text-sm font-medium text-success-900">
                          {nextCycle.academicCycle.customLabel ??
                            nextCycle.academicCycle.globalCycle?.label ??
                            "Upcoming Cycle"}
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-foreground-600 mb-1">
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
                          <p className="text-sm text-foreground-600 mb-1">
                            End Date
                          </p>
                          <p className="font-medium text-foreground">
                            {formatDate(
                              nextCycle.academicCycle.endDate ??
                                nextCycle.academicCycle.globalCycle?.endDate ??
                                "",
                            )}
                          </p>
                        </div>
                      </div>

                      {nextCycle.registrationPeriod && (
                        <div className="mt-4 pt-4 border-t border-success-200">
                          <div className="flex items-center gap-2 mb-2">
                            <ClockIcon className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium text-success-900">
                              Registration Period
                            </span>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-sm text-foreground-600 mb-1">
                                Opens
                              </p>
                              <p className="font-medium text-foreground">
                                {formatDate(
                                  nextCycle.registrationPeriod.startDate,
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-foreground-600 mb-1">
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
                    <div className="rounded-lg bg-primary-50 border border-primary-200 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge color="primary" variant="flat" size="sm">
                          Current Cycle
                        </Badge>
                        <span className="text-sm font-medium text-primary-900">
                          {currentCycle.academicCycle.customLabel ??
                            currentCycle.academicCycle.globalCycle?.label ??
                            "Current Cycle"}
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-foreground-600 mb-1">
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
                          <p className="text-sm text-foreground-600 mb-1">
                            End Date
                          </p>
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
