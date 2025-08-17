import { notFound } from "next/navigation";

import { parseISO } from "date-fns";

import { getOrgInstanceWithProgram } from "./lib/getOrgInstanceWithProgram";
import { ProgramGalleryCarousel } from "./components/ProgramGalleryCarousel";
import { ProgramHeroSection } from "./components/ProgramHeroSection";
import { ProgramCycleSelectionProvider } from "./context/ProgramCycleSelectionContext";
import { ProgramDetailMobileFooter } from "./components/footer/ProgramDetailMobileFooter";
import { CurriculumSection } from "./components/CurriculumSection";
import { ActivitiesSection } from "./components/ActivitiesSection";
import { TeachersSection } from "./components/TeachersSection";
import { LocationSection } from "./components/LocationSection";
import { LocationFeaturesSection } from "./components/LocationFeaturesSection";
import { ProgramsSection } from "./components/ProgramsSection";
import { PricingSection } from "./components/PricingSection";
import { ProgramTracking } from "./components/ProgramTracking";
import { CycleSection } from "./components/CycleSection";
import { ProgramTestimonialsSection } from "./components/ProgramTestimonialsSection";
import { RequirementsSection } from "./components/RequirementsSection";
import { ProgramHighlightsSection } from "./components/ProgramHighlightsSection";
import { OrgBadgeSection } from "./components/OrgBadgeSection";
import { ProgramDescriptionSection } from "./components/ProgramDescriptionSection";

import { ProgramGroupTracking } from "./components/ProgramGroupTracking";
import { ProgramsInGroupSection } from "./components/ProgramsInGroupSection";
import { OrgHighlightsSection } from "./components/OrgHighlightsSection";

const retreiveOrgInstanceWithProgram = async (
  username: string,
  slug: string,
) => {
  const result = await getOrgInstanceWithProgram(username, slug);
  if (!result?.program && !result?.group) return notFound();
  return result;
};
interface ProgramDetailsPageProps {
  params: Promise<{ username: string; slug: string }>;
}

// Helper function to get current date (start of day in local timezone)
const getCurrentDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Helper function to check if date is in the future (inclusive of today)
const isDateInFuture = (dateString: string) => {
  const date = parseISO(dateString);
  const currentDate = getCurrentDate();
  // Consider dates starting from today as "future" for cycle selection
  return date >= currentDate;
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

  const { orgInstance, program, group } = await retreiveOrgInstanceWithProgram(
    username,
    slug,
  );

  let programToUse = program;

  // if group, then take the first program and use that.
  if (group?.programs?.[0]) {
    programToUse = group.programs[0];
  }

  if (programToUse) {
    // Get all future cycles (including next)
    const futureCycles = programToUse.cycles
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
    const currentCycle = programToUse.cycles?.find((cycle) => {
      const startDate =
        cycle.academicCycle.startDate ??
        cycle.academicCycle.globalCycle?.startDate;
      const endDate =
        cycle.academicCycle.endDate ?? cycle.academicCycle.globalCycle?.endDate;
      if (!startDate || !endDate) return false;
      return getCycleStatus(startDate, endDate) === "current";
    });

    // Get the default teacher for SSR
    const defaultCycle = currentCycle ?? nextCycle;
    const defaultTeachers = defaultCycle?.teachers ?? null;

    return (
      <ProgramCycleSelectionProvider
        program={programToUse}
        defaultCycle={defaultCycle}
      >
        {group && <ProgramGroupTracking group={group} />}
        <ProgramTracking program={programToUse} defaultCycle={defaultCycle} />

        <ProgramGalleryCarousel program={programToUse} />

        <div className="container mx-auto max-w-7xl px-4">
          <ProgramHeroSection
            orgInstance={orgInstance}
            program={programToUse}
          />

          <OrgBadgeSection orgInstance={orgInstance} program={programToUse} />

          <ProgramHighlightsSection program={programToUse} />

          <ProgramDescriptionSection program={programToUse} />

          <CycleSection program={programToUse} defaultCycle={defaultCycle} />

          <CurriculumSection program={programToUse} />

          <ActivitiesSection program={programToUse} />

          <TeachersSection
            defaultTeachers={defaultTeachers}
            program={programToUse}
          />

          <LocationFeaturesSection
            orgInstance={orgInstance}
            program={programToUse}
          />

          <LocationSection orgInstance={orgInstance} program={programToUse} />

          <ProgramTestimonialsSection
            testimonials={programToUse.testimonials}
            program={programToUse}
          />
          <OrgHighlightsSection
            orgInstance={orgInstance}
            program={programToUse}
          />

          <PricingSection
            defaultCycle={currentCycle ?? nextCycle}
            program={programToUse}
          />

          <ProgramsInGroupSection
            orgInstance={orgInstance}
            program={programToUse}
          />

          <RequirementsSection program={programToUse} />
          <ProgramsSection
            orgInstance={orgInstance}
            currentProgram={programToUse}
          />
        </div>

        <ProgramDetailMobileFooter
          orgInstance={orgInstance}
          program={programToUse}
        />
      </ProgramCycleSelectionProvider>
    );
  }

  if (group) {
    return (
      <div className="min-h-screen bg-background">
        <ProgramGroupTracking group={group} />

        {/* Programs Grid */}
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {group.name}
            </h1>
            <p className="text-muted-foreground">{group.description}</p>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No programs available in this group.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
