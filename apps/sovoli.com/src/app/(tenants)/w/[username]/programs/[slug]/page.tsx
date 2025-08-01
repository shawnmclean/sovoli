import { notFound } from "next/navigation";

import { parseISO } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { getOrgInstanceWithProgram } from "./lib/getOrgInstanceWithProgram";
import { ProgramGalleryCarousel } from "./components/ProgramGalleryCarousel";
import { ProgramHeroSection } from "./components/ProgramHeroSection";
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
import { ProgramTestimonialsSection } from "./components/ProgramTestimonialsSection";
import { RequirementsSection } from "./components/RequirementsSection";
import { ProgramHighlightsSection } from "./components/ProgramHighlightsSection";
import { OrgBadgeSection } from "./components/OrgBadgeSection";
import { ProgramDescriptionSection } from "./components/ProgramDescriptionSection";
import { ProgramCycleCard } from "../../(main-layout)/programs/components/ProgramCycleCard";
import { ProgramGroupTracking } from "./components/ProgramGroupTracking";

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
  if (program) {
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

    // Get the default teacher for SSR
    const defaultCycle = currentCycle ?? nextCycle;
    const defaultTeachers = defaultCycle?.teachers ?? null;

    return (
      <ProgramCycleSelectionProvider
        program={program}
        defaultCycle={defaultCycle}
      >
        <ProgramTracking program={program} defaultCycle={defaultCycle} />

        <ProgramGalleryCarousel program={program} />

        <div className="container mx-auto max-w-7xl px-4">
          <ProgramHeroSection orgInstance={orgInstance} program={program} />

          <OrgBadgeSection orgInstance={orgInstance} />

          <ProgramHighlightsSection program={program} />

          <ProgramDescriptionSection program={program} />

          <CycleSection program={program} defaultCycle={defaultCycle} />

          <CurriculumSection program={program} />

          <TeachersSection defaultTeachers={defaultTeachers} />

          <RequirementsSection program={program} />

          <LocationFeaturesSection orgInstance={orgInstance} />

          <LocationSection orgInstance={orgInstance} program={program} />

          <ProgramTestimonialsSection testimonials={program.testimonials} />

          <PricingSection defaultCycle={currentCycle ?? nextCycle} />

          <ProgramsSection orgInstance={orgInstance} currentProgram={program} />
        </div>

        <ProgramDetailMobileFooter
          orgInstance={orgInstance}
          program={program}
        />
      </ProgramCycleSelectionProvider>
    );
  }

  if (group) {
    return (
      <div className="min-h-screen bg-background">
        <ProgramGroupTracking group={group} />

        {/* Hero Section */}
        <section className="w-full bg-card text-foreground px-4 py-12 md:py-20 text-center">
          <div className="container mx-auto max-w-4xl">
            <div className="max-w-xl mx-auto space-y-4 mb-8">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                {group.name}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                {group.description}
              </p>
              <p className="text-sm text-muted-foreground">
                ✅ Trusted by 200+ families near Mon Repos, Guyana
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 mb-10">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm shadow-sm bg-warning text-warning-foreground animate-pulse`}
                aria-label="Limited Spots Available"
              >
                <span>📅</span>
                <span>Limited Spots Available</span>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm shadow-sm bg-success-300 text-success-900`}
                aria-label="Discounts Available"
              >
                <span>💸</span>
                <span>Discounts Available</span>
              </div>
            </div>

            <div className="flex justify-center">
              <p className="text-sm text-muted-foreground flex items-center gap-1 animate-bounce">
                <ChevronDownIcon className="w-4 h-4" />
                View Programs Below
              </p>
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Available Programs
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {group.programs?.map((program) => (
              <ProgramCycleCard
                key={program.id}
                program={program}
                orgInstance={orgInstance}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
