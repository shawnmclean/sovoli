import type { AcademicModule, Program } from "~/modules/academics/types";

const VAZ_PREP_EARLY_CHILDHOOD_PROGRAM: Program = {
  id: "vazprep-early-childhood",
  slug: "early-childhood",
  name: "Early Childhood Programme",
  audience: "parent",
  description:
    "For children 18 months to 5 years, Vaz Prep provides a safe, nurturing environment that blends Christian values with play-based learning to build foundational skills.",
  tagline: "Nurturing young minds with love and discovery",
  outcome:
    "Children transition into primary school with confidence, early literacy skills, and a love for learning.",
  quickFacts: [
    "Ages: 18 months – 5 years",
    "Student-Teacher Ratio: Small groups for individualized attention",
    "School Hours: 7:30 a.m. – 3:00 p.m.",
  ],
  highlights: [
    {
      icon: "baby",
      label: "Toddler Care",
      description:
        "Accepts children as young as 18 months in a stimulating, caring environment with age-appropriate activities.",
    },
    {
      icon: "users",
      label: "Small Class Sizes",
      description: "Low student-teacher ratios allow teachers to tailor instruction to each child.",
    },
    {
      icon: "shield-check",
      label: "Values & Play",
      description: "Daily routines integrate Christian values, character building, and purposeful play.",
    },
  ],
};

const VAZ_PREP_PRIMARY_PROGRAM: Program = {
  id: "vazprep-primary",
  slug: "primary-division",
  name: "Primary Division (Grades 1–6)",
  audience: "parent",
  description:
    "Builds on strong academic foundations with a balanced curriculum across academics, sports, and the arts while emphasising discipline and Christian character.",
  tagline: "Excellence in academics and character",
  outcome:
    "Graduates excel in PEP and secondary school placement, emerging as well-rounded, disciplined citizens.",
  quickFacts: [
    "Grades: 1 through 6",
    "Curriculum: National Primary Curriculum with Primary Exit Profile (PEP) preparation",
    "Extracurriculars: 10+ clubs and teams across academics, culture, and sports",
  ],
  highlights: [
    {
      icon: "star",
      label: "Academic Excellence",
      description: "Consistently ranks among Jamaica’s top preparatory schools for national exam performance.",
    },
    {
      icon: "palette",
      label: "Holistic Development",
      description: "Robust cultural, sports, and service programmes complement classroom learning.",
    },
    {
      icon: "badge-check",
      label: "Championship Legacy",
      description: "Regular winners in Spelling Bee, JCDC cultural contests, and quiz competitions.",
    },
    {
      icon: "shield-check",
      label: "Values & Discipline",
      description: "Strong emphasis on Christian values, respect, and personal responsibility.",
    },
  ],
  activities: [
    { id: "builders-club", title: "Builders Club" },
    { id: "chess-club", title: "Chess Club" },
    { id: "dance-team", title: "Dance" },
    { id: "football-team", title: "Football" },
    { id: "karate-club", title: "Karate" },
    { id: "netball-team", title: "Netball" },
    { id: "red-cross-club", title: "Red Cross" },
    { id: "spanish-club", title: "Spanish Club" },
    { id: "swimming-team", title: "Swimming" },
    { id: "table-tennis", title: "Table Tennis" },
    { id: "track-and-field", title: "Track & Field" },
  ],
};

const VAZ_PREP_CREATIVE_LEARNING_PROGRAM: Program = {
  id: "vazprep-creative-learning",
  slug: "creative-learning-centre",
  name: "Creative Learning Centre",
  audience: "parent",
  description:
    "Individualised programme for students ages 6–12 with mild to moderate learning challenges, offering targeted reading, numeracy, and social skills intervention in small groups.",
  tagline: "No child left behind",
  outcome:
    "Students strengthen core skills, build confidence, and many reintegrate into mainstream classrooms within two years.",
  quickFacts: [
    "Ages: 6 – 12 years",
    "Capacity: 25 students (typical class size 5–8)",
    "Setting: Adjacent centre offering a calm, supportive environment",
  ],
  highlights: [
    {
      icon: "users",
      label: "Small Group Instruction",
      description: "Tiny class sizes support intensive, personalised teaching and therapy.",
    },
    {
      icon: "book-open",
      label: "Individualised Curriculum",
      description: "Each learner follows an Individualised Education Programme guided by specialist assessments.",
    },
    {
      icon: "badge-check",
      label: "Ministry Endorsed",
      description: "Recognised by the Ministry of Education as a model for special education at the primary level.",
    },
  ],
};

export const VAZ_PREP_ACADEMIC: AcademicModule = {
  studentCount: 1300,
  programs: [
    VAZ_PREP_EARLY_CHILDHOOD_PROGRAM,
    VAZ_PREP_PRIMARY_PROGRAM,
    VAZ_PREP_CREATIVE_LEARNING_PROGRAM,
  ],
};
