import { parseISO } from "date-fns";
import { TeachersDetails } from "../../components/teachers/TeachersDetails";
import { getOrgInstanceWithProgram } from "../../lib/getOrgInstanceWithProgram";

interface Props {
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

export default async function TeachersPage({ params }: Props) {
  const { username, slug } = await params;
  const result = await getOrgInstanceWithProgram(username, slug);

  if (!result) {
    return null;
  }

  const program = result.program ?? result.group?.programs?.[0];

  if (!program) {
    return null;
  }

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

  // Get the default teacher for SSR (same logic as layout)
  const defaultCycle = currentCycle ?? nextCycle;
  const defaultTeachers = defaultCycle?.teachers ?? null;

  return (
    <TeachersDetails defaultTeachers={defaultTeachers} program={program} />
  );
}
