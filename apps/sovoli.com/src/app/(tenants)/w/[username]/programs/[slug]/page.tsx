import { notFound } from "next/navigation";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";

import {
  ClockIcon,
  UserIcon,
  StarIcon,
  UsersIcon,
  BookOpenIcon,
  GraduationCapIcon,
} from "lucide-react";
import { parseISO } from "date-fns";

import { displayAgeRange } from "../../(main-layout)/programs/utils";
import { getOrgInstanceWithProgram } from "./lib/getOrgInstanceWithProgram";
import { ProgramGalleryCarousel } from "./components/ProgramGalleryCarousel";
import { ProgramHero } from "./components/ProgramHero";
import { ProgramCycleSelectionProvider } from "./context/ProgramCycleSelectionContext";
import { ProgramDetailMobileFooter } from "./components/footer/ProgramDetailMobileFooter";
import { CurriculumSection } from "./components/CurriculumSection";
import { TeachersSection } from "./components/TeachersSection";
import { LocationSection } from "./components/LocationSection";
import { LocationFeaturesSection } from "./components/LocationFeaturesSection";
import { ProgramsSection } from "./components/ProgramsSection";
import { PricingSection } from "./components/PricingSection";
import { ProgramTracking } from "./components/ProgramTracking";
import { CycleSection } from "./components/CycleSection";

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

  // Get all future cycles (including next)
  const futureCycles = program.cycles
    ?.filter((cycle) => {
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
  const nextCycle = futureCycles?.[0];

  // Get the current cycle
  const currentCycle = program.cycles?.find((cycle) => {
    const startDate =
      cycle.academicCycle.startDate ??
      cycle.academicCycle.globalCycle?.startDate;
    const endDate =
      cycle.academicCycle.endDate ?? cycle.academicCycle.globalCycle?.endDate;
    if (!startDate || !endDate) return false;
    return getCycleStatus(startDate, endDate) === "current";
  });

  // Get organization contact info

  // Get the default teacher for SSR
  const defaultCycle = currentCycle ?? nextCycle;
  const defaultTeachers = defaultCycle?.teachers ?? null;

  return (
    <ProgramCycleSelectionProvider program={program}>
      <ProgramTracking program={program} defaultCycle={defaultCycle} />
      <ProgramGalleryCarousel program={program} />
      <ProgramHero orgInstance={orgInstance} program={program} />

      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Program Highlights */}
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

            {/* Curriculum */}
            <CurriculumSection program={program} />

            <CycleSection program={program} defaultCycle={defaultCycle} />

            {/* Teachers */}
            <TeachersSection defaultTeachers={defaultTeachers} />

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

            <LocationFeaturesSection orgInstance={orgInstance} />

            <LocationSection orgInstance={orgInstance} />
          </div>

          {/* Pricing Information */}
          <PricingSection defaultCycle={currentCycle ?? nextCycle} />
        </div>
      </div>

      <ProgramsSection orgInstance={orgInstance} currentProgram={program} />

      <ProgramDetailMobileFooter orgInstance={orgInstance} program={program} />
    </ProgramCycleSelectionProvider>
  );
}
