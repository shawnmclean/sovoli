import { notFound, redirect } from "next/navigation";
import { Footer } from "../../components/footer/Footer";
import { parseISO } from "date-fns";
import type { EducationalOccupationalProgram, WithContext } from "schema-dts";

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
import { LocationFeaturesSection } from "./components/locationFeatures/LocationFeaturesSection";
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
  } = await retreiveOrgInstanceWithProgram(username, slug);

  const programName =
    program?.name ?? program?.standardProgramVersion?.program.name ?? "";
  const programDescription =
    program?.description ??
    program?.standardProgramVersion?.program.description ??
    "";

  const group =
    program?.group ?? program?.standardProgramVersion?.program.group;

  const title = `${programName} ${group ? `- ${group.name}` : ""}`;

  return {
    title: title,
    description: programDescription,
    openGraph: {
      title: `${title} | ${website.siteName}`,
      description: programDescription,
      type: "website",
      images: [
        {
          url:
            program?.photos?.[0]?.url ??
            program?.standardProgramVersion?.program.image ??
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

  // Build more complete structured data
  const programName =
    programToUse.name ?? programToUse.standardProgramVersion?.program.name;
  const programDescription =
    programToUse.description ??
    programToUse.standardProgramVersion?.program.description;

  const programSchema: WithContext<EducationalOccupationalProgram> = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: programName,
    description: programDescription,
    provider: {
      "@id": `${orgInstance.websiteModule.website.url}#org`,
    },
    ...(programToUse.photos?.[0]?.url && {
      image: programToUse.photos[0].url,
    }),
    ...(defaultCycle && {
      offers: {
        "@type": "Offer",
        ...(defaultCycle.academicCycle.startDate && {
          validFrom: defaultCycle.academicCycle.startDate,
        }),
        ...(defaultCycle.academicCycle.endDate && {
          validThrough: defaultCycle.academicCycle.endDate,
        }),
        availability: "https://schema.org/InStock",
        // Add pricing information
        ...(() => {
          // Find tuition pricing (primary cost)
          const tuitionItem = defaultCycle.pricingPackage.pricingItems.find(
            (item) => item.purpose === "tuition",
          );

          if (tuitionItem) {
            // Get the first available currency and amount
            const currencyEntry = Object.entries(tuitionItem.amount).find(
              ([_, amount]) => amount && amount > 0,
            );

            if (currencyEntry) {
              const [currency, amount] = currencyEntry;
              return {
                price: amount,
                priceCurrency: currency,
                priceSpecification: {
                  "@type": "PriceSpecification" as const,
                  price: amount,
                  priceCurrency: currency,
                  ...(tuitionItem.billingCycle === "term" && {
                    unitText: "per term",
                  }),
                  ...(tuitionItem.billingCycle === "annual" && {
                    unitText: "per year",
                  }),
                  ...(tuitionItem.billingCycle === "one-time" && {
                    unitText: "one-time",
                  }),
                  ...(tuitionItem.billingCycle === "program" && {
                    unitText: "per program",
                  }),
                },
              };
            }
          }
          return {};
        })(),
      },
    }),
    ...(defaultCycle?.academicCycle.startDate && {
      startDate: defaultCycle.academicCycle.startDate,
    }),
    ...(defaultCycle?.academicCycle.endDate && {
      endDate: defaultCycle.academicCycle.endDate,
    }),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(programSchema, null, 0), // Compact JSON without whitespace
        }}
      />
      <ProgramDetailNavbar
        orgInstance={orgInstance}
        program={programToUse}
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
        <NavigationDrawer fallbackPath={`/programs/${programToUse.slug}`}>
          {modals}
        </NavigationDrawer>
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
          defaultCycle={currentCycle ?? nextCycle}
        />
        {children}
      </ProgramCycleSelectionProvider>

      <Footer orgInstance={orgInstance} />
    </div>
  );
}
