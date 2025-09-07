import type {
  WorkforceMember,
  WorkforceModule,
} from "~/modules/workforce/types";
import {
  ADMIN,
  FACULTY,
  SUPPORT,
  PRINCIPAL,
  NURSERY_TEACHER,
  TEACHING_ASSISTANT,
  CARETAKER,
} from "./workforceMeta";

export const APPLETON_PRINCIPAL: WorkforceMember = {
  id: "appleton-principal",
  name: "Principal",
  slug: "principal",
  image: "/orgs/private-schools/jamaica/appleton/workforce/principal.webp",
  bio: "Leading our school with passion and dedication to early childhood education",
  quote:
    "Every child deserves a nurturing environment where they can grow, learn, and discover their potential.",
  isPublic: true,
  contacts: [
    {
      type: "email",
      value: "principal@absjm.sovoli.com",
      isPublic: true,
    },
  ],
  roleAssignments: [
    {
      position: PRINCIPAL,
      department: ADMIN,
      isPrimary: true,
    },
  ],
  education: [
    {
      level: "Master of Education",
      field: "Early Childhood Education",
      institution: "University of the West Indies",
      location: "Jamaica",
    },
    {
      level: "Bachelor of Education",
      field: "Educational Leadership",
      institution: "University of the West Indies",
      location: "Jamaica",
    },
  ],
};

export const APPLETON_NURSERY1_TEACHER: WorkforceMember = {
  id: "appleton-nursery1-teacher",
  name: "Nursery Year 1 Teacher",
  slug: "nursery-year-1-teacher",
  image:
    "/orgs/private-schools/jamaica/appleton/workforce/nursery1-teacher.webp",
  bio: "Specialized in early childhood development and play-based learning",
  quote:
    "Learning should be fun and engaging. I love watching children discover new things every day.",
  isPublic: true,
  contacts: [
    {
      type: "email",
      value: "nursery1@absjm.sovoli.com",
      isPublic: true,
    },
  ],
  roleAssignments: [
    {
      position: NURSERY_TEACHER,
      department: FACULTY,
      titleOverride: "Lead Teacher - Nursery Year 1",
      isPrimary: true,
    },
  ],
  education: [
    {
      level: "Bachelor of Education",
      field: "Early Childhood Education",
      institution: "University of the West Indies",
      location: "Jamaica",
    },
    {
      level: "Certificate",
      field: "Child Development",
      institution: "Early Childhood Commission",
      location: "Jamaica",
    },
  ],
  subjectAssignments: [
    {
      subject: "Language Development",
      grades: ["Nursery Year 1"],
    },
    {
      subject: "Social Skills",
      grades: ["Nursery Year 1"],
    },
    {
      subject: "Creative Arts",
      grades: ["Nursery Year 1"],
    },
  ],
};

export const APPLETON_NURSERY2_TEACHER: WorkforceMember = {
  id: "appleton-nursery2-teacher",
  name: "Nursery Year 2 Teacher",
  slug: "nursery-year-2-teacher",
  image:
    "/orgs/private-schools/jamaica/appleton/workforce/nursery2-teacher.webp",
  bio: "Expert in preparing children for primary school transition",
  quote:
    "My goal is to ensure every child is ready and excited for their next learning adventure.",
  isPublic: true,
  contacts: [
    {
      type: "email",
      value: "nursery2@absjm.sovoli.com",
      isPublic: true,
    },
  ],
  roleAssignments: [
    {
      position: NURSERY_TEACHER,
      department: FACULTY,
      titleOverride: "Lead Teacher - Nursery Year 2",
      isPrimary: true,
    },
  ],
  education: [
    {
      level: "Bachelor of Education",
      field: "Early Childhood Education",
      institution: "University of the West Indies",
      location: "Jamaica",
    },
    {
      level: "Certificate",
      field: "Primary Education",
      institution: "Teachers' College",
      location: "Jamaica",
    },
  ],
  subjectAssignments: [
    {
      subject: "School Readiness",
      grades: ["Nursery Year 2"],
    },
    {
      subject: "Literacy Development",
      grades: ["Nursery Year 2"],
    },
    {
      subject: "Mathematics",
      grades: ["Nursery Year 2"],
    },
  ],
};

export const APPLETON_TEACHING_ASSISTANT: WorkforceMember = {
  id: "appleton-assistant",
  name: "Teaching Assistant",
  slug: "teaching-assistant",
  image: "/orgs/private-schools/jamaica/appleton/workforce/assistant.webp",
  bio: "Supporting our teachers and students with care and dedication",
  quote:
    "I believe in creating a supportive environment where every child feels valued and encouraged.",
  isPublic: true,
  contacts: [
    {
      type: "email",
      value: "assistant@absjm.sovoli.com",
      isPublic: true,
    },
  ],
  roleAssignments: [
    {
      position: TEACHING_ASSISTANT,
      department: SUPPORT,
      isPrimary: true,
    },
  ],
  education: [
    {
      level: "Certificate",
      field: "Child Care",
      institution: "Early Childhood Commission",
      location: "Jamaica",
    },
    {
      level: "Certificate",
      field: "First Aid",
      institution: "Red Cross Jamaica",
      location: "Jamaica",
    },
  ],
};

export const APPLETON_CARETAKER: WorkforceMember = {
  id: "appleton-caretaker",
  name: "School Caretaker",
  slug: "school-caretaker",
  image: "/orgs/private-schools/jamaica/appleton/workforce/caretaker.webp",
  bio: "Maintaining our school facilities to ensure a clean and safe environment",
  quote:
    "A clean and safe environment is essential for children to learn and grow.",
  isPublic: true,
  contacts: [
    {
      type: "email",
      value: "caretaker@absjm.sovoli.com",
      isPublic: true,
    },
  ],
  roleAssignments: [
    {
      position: CARETAKER,
      department: SUPPORT,
      titleOverride: "Facilities Manager",
      isPrimary: true,
    },
  ],
  education: [
    {
      level: "Certificate",
      field: "Facilities Management",
      institution: "Jamaica Institute of Management",
      location: "Jamaica",
    },
    {
      level: "Certificate",
      field: "Safety Protocols",
      institution: "Occupational Safety and Health Authority",
      location: "Jamaica",
    },
  ],
};

export const APPLETON_BASIC_SCHOOL_WORKFORCE: WorkforceModule = {
  members: [
    APPLETON_PRINCIPAL,
    APPLETON_NURSERY1_TEACHER,
    APPLETON_NURSERY2_TEACHER,
    APPLETON_TEACHING_ASSISTANT,
    APPLETON_CARETAKER,
  ],
  departments: [ADMIN, FACULTY, SUPPORT],
  teams: [],
  positions: [PRINCIPAL, NURSERY_TEACHER, TEACHING_ASSISTANT, CARETAKER],
};
