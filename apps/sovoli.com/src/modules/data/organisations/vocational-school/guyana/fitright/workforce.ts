import type {
  WorkforceMember,
  WorkforceModule,
  Position,
  Department,
} from "~/modules/workforce/types";

// Define departments and positions for FitRight
const INSTRUCTOR: Position = {
  name: "Instructor",
  slug: "instructor",
  description: "Sewing and fashion design instructor",
  image: "/orgs/vocational-training/guyana/fitright/team/instructor.webp",
  url: "/orgs/vocational-training/guyana/fitright/team",
};

const FACULTY: Department = {
  name: "Faculty",
  slug: "faculty",
  description: "Teaching staff and instructors",
  image: "/orgs/vocational-training/guyana/fitright/team/faculty.webp",
  url: "/orgs/vocational-training/guyana/fitright/team",
};

export const XAVIRINE_DORNELLAS: WorkforceMember = {
  id: "001",
  name: "Xavirine D'Ornellas",
  slug: "xavirine-dornellas",
  image: "/orgs/vocational-training/guyana/fitright/team/xavirine.webp",
  bio: "Xavirine D'Ornellas is a passionate teacher born in Guyana with over a decade of experience in design, sewing, and teaching. Her passion for design and sewing began at the age of seven when she started designing and sewing clothes for her dolls, and by fourteen, she was making clothes for herself. She worked as a school teacher in Guyana for many years, successfully tutoring students in the art of making their own clothes. Her teaching method, known as the 'Xavie teaching method,' is fun, approachable, and rich with helpful tips and techniques aimed at helping students transform fabric into beautiful, well-fitted garments. She has a very open mind and loves supporting new ideas. Her professional experience includes working in couture tailoring in French Guyana, St Lucia, and New York.",
  quote:
    "Transform fabric into beautiful, well-fitted garments with fun and approachable techniques.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: INSTRUCTOR,
      department: FACULTY,
      isPrimary: true,
    },
  ],
  subjectAssignments: [
    {
      subject: "Sewing",
      grades: ["Beginner", "Elementary", "Intermediate", "Advanced"],
    },
    {
      subject: "Pattern Making",
      grades: ["Elementary", "Intermediate", "Advanced"],
    },
    { subject: "Fashion Design", grades: ["Intermediate", "Advanced"] },
    {
      subject: "Dressmaking",
      grades: ["Elementary", "Intermediate", "Advanced"],
    },
  ],
  education: [
    {
      level: "Bachelor of Science",
      field: "Production Management Clothing Designing",
      institution: "Fashion Institute of Technology (FIT)",
      location: "New York, USA",
    },
    {
      level: "Associate Degree",
      field: "Dressmaking Technology",
      institution: "Fashion Institute of Technology (FIT)",
      location: "New York, USA",
    },
    {
      level: "Diploma",
      field: "Fashion Merchandising",
      institution: "ICS",
    },
    {
      level: "Certificate",
      field: "Dressmaking & Pattern Making",
    },
  ],
};

export const FITRIGHT_WORKFORCE: WorkforceModule = {
  departments: [FACULTY],
  positions: [INSTRUCTOR],
  teams: [],
  members: [XAVIRINE_DORNELLAS],
};
