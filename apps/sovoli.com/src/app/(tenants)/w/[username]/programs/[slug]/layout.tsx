import { notFound, redirect } from "next/navigation";
import { Footer } from "../../components/footer/Footer";
import { parseISO } from "date-fns";

import { ProgramDetailNavbar } from "./components/navbar/ProgramDetailMobileNavbar";
import { getOrgInstanceWithProgram } from "./lib/getOrgInstanceWithProgram";
import { Alert } from "@sovoli/ui/components/alert";
import { ProgramGalleryCarousel } from "./components/ProgramGalleryCarousel";
import { ProgramHeroSection } from "./components/ProgramHeroSection";
import { ProgramCycleSelectionProvider } from "./context/ProgramCycleSelectionContext";
import { ProgramDetailMobileFooter } from "./components/footer/ProgramDetailMobileFooter";
import { CurriculumSection } from "./components/curriculum/CurriculumSection";
import { ActivitiesSection } from "./components/activities/ActivitiesSection";
import { TeachersSection } from "./components/teachers/TeachersSection";
import { LocationSection } from "./components/LocationSection";
import { LocationFeaturesSection } from "./components/LocationFeaturesSection";
import { ProgramsSection } from "./components/ProgramsSection";
import { PricingSection } from "./components/PricingSection";
import { ProgramTracking } from "./components/ProgramTracking";
import { CycleSection } from "./components/CycleSection";
import { ProgramTestimonialsSection } from "./components/ProgramTestimonialsSection";
import { RequirementsSection } from "./components/requirements/RequirementsSection";
import { ProgramHighlightsSection } from "./components/ProgramHighlightsSection";
import { OrgBadgeSection } from "./components/OrgBadgeSection";
import { ProgramDescriptionSection } from "./components/ProgramDescriptionSection";
import { ProgramGroupTracking } from "./components/ProgramGroupTracking";
import { ProgramsInGroupSection } from "./components/ProgramsInGroupSection";
import { OrgHighlightsSection } from "./components/orgHighlights/OrgHighlightsSection";
import { NavigationDrawer } from "~/app/(tenants)/w/[username]/components/NavigationDrawer";

const retreiveOrgInstanceWithProgram = async (
  username: string,
  slug: string,
) => {
  const result = await getOrgInstanceWithProgram(username, slug);
  if (!result?.program && !result?.group) return notFound();

  // If it's a group, redirect to the first program
  if (result.group?.programs?.[0]) {
    redirect(`/programs/${result.group.programs[0].slug}`);
  }

  return result;
};

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

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string; slug: string }>;
  modals: React.ReactNode;
}

export async function generateMetadata({ params }: Props) {
  const { username, slug } = await params;
  const {
    orgInstance: {
      websiteModule: { website },
    },
    program,
    group,
  } = await retreiveOrgInstanceWithProgram(username, slug);

  const programName =
    program?.name ??
    program?.standardProgramVersion?.program.name ??
    group?.name ??
    "";
  const programDescription =
    program?.description ??
    program?.standardProgramVersion?.program.description ??
    group?.description ??
    "";

  return {
    title: programName,
    description: programDescription,
    openGraph: {
      title: `${programName} | ${website.siteName}`,
      description: programDescription,
      type: "website",
      images: [
        {
          url:
            program?.photos?.[0]?.url ??
            program?.standardProgramVersion?.program.image ??
            group?.programs?.[0]?.photos?.[0]?.url ??
            group?.programs?.[0]?.standardProgramVersion?.program.image ??
            "",
          width: 1200,
          height: 630,
          alt: programName,
        },
      ],
    },
  };
}

export default async function Layout({ children, params, modals }: Props) {
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

  if (!programToUse) {
    return notFound();
  }

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
    <div className="flex min-h-screen flex-col">
      <ProgramDetailNavbar
        orgInstance={orgInstance}
        program={program}
        group={group}
      />
      <Alert
        className="hidden md:flex"
        variant="flat"
        color="warning"
        title="Website optimized for mobile devices. Use your phone please."
      />
      <ProgramCycleSelectionProvider
        program={programToUse}
        defaultCycle={defaultCycle}
      >
        <NavigationDrawer program={programToUse}>{modals}</NavigationDrawer>
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

          <CurriculumSection program={programToUse} />
          <ActivitiesSection program={programToUse} />

          <CycleSection program={programToUse} defaultCycle={defaultCycle} />

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
        {children}
      </ProgramCycleSelectionProvider>

      <Footer orgInstance={orgInstance} />
    </div>
  );
}
