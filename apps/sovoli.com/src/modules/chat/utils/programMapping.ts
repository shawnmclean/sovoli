import type { ProgramInfo, AgeSelection } from "../types/guided-chat";

// Program configurations based on age ranges
export const PROGRAMS: ProgramInfo[] = [
  {
    id: "toddler",
    name: "Toddler Program",
    description: "Early learning and development for toddlers",
    ageRange: {
      minYears: 1,
      minMonths: 6,
      maxYears: 3,
      maxMonths: 0,
    },
  },
  {
    id: "preschool",
    name: "Preschool Program",
    description: "Pre-kindergarten preparation and social development",
    ageRange: {
      minYears: 3,
      minMonths: 0,
      maxYears: 5,
      maxMonths: 0,
    },
  },
  {
    id: "kindergarten",
    name: "Kindergarten Program",
    description: "Foundation for academic learning and school readiness",
    ageRange: {
      minYears: 5,
      minMonths: 0,
      maxYears: 6,
      maxMonths: 0,
    },
  },
  {
    id: "elementary",
    name: "Elementary Program",
    description: "Core academic subjects and skill development",
    ageRange: {
      minYears: 6,
      minMonths: 0,
      maxYears: 12,
      maxMonths: 0,
    },
  },
  {
    id: "middle-school",
    name: "Middle School Program",
    description: "Advanced learning and preparation for high school",
    ageRange: {
      minYears: 12,
      minMonths: 0,
      maxYears: 15,
      maxMonths: 0,
    },
  },
  {
    id: "high-school",
    name: "High School Program",
    description: "College preparation and advanced academics",
    ageRange: {
      minYears: 15,
      minMonths: 0,
      maxYears: 18,
      maxMonths: 0,
    },
  },
];

export function getProgramForAge(age: AgeSelection): ProgramInfo | null {
  const totalMonths = age.years * 12 + age.months;

  for (const program of PROGRAMS) {
    const minTotalMonths =
      program.ageRange.minYears * 12 + program.ageRange.minMonths;
    const maxTotalMonths =
      program.ageRange.maxYears * 12 + program.ageRange.maxMonths;

    if (totalMonths >= minTotalMonths && totalMonths <= maxTotalMonths) {
      return program;
    }
  }

  return null;
}

export function formatAgeDisplay(age: AgeSelection): string {
  if (age.years === 0) {
    return `${age.months} month${age.months !== 1 ? "s" : ""}`;
  } else if (age.months === 0) {
    return `${age.years} year${age.years !== 1 ? "s" : ""}`;
  } else {
    return `${age.years} year${age.years !== 1 ? "s" : ""} ${age.months} month${age.months !== 1 ? "s" : ""}`;
  }
}
