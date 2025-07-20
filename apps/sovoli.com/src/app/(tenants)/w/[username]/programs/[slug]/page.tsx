import { notFound } from "next/navigation";

import { parseISO } from "date-fns";
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
import { ProgramTestimonials } from "./components/ProgramTestimonials";
import { RequirementsSection } from "./components/RequirementsSection";
import { ProgramHighlights } from "./components/ProgramHighlights";

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
            <ProgramHighlights />

            {/* Curriculum */}
            <CurriculumSection program={program} />

            <CycleSection program={program} defaultCycle={defaultCycle} />

            {/* Teachers */}
            <TeachersSection defaultTeachers={defaultTeachers} />

            {/* Requirements */}
            <RequirementsSection program={program} />

            <LocationFeaturesSection orgInstance={orgInstance} />

            <LocationSection orgInstance={orgInstance} program={program} />

            {/* Testimonials */}
            <ProgramTestimonials testimonials={program.testimonials} />
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
