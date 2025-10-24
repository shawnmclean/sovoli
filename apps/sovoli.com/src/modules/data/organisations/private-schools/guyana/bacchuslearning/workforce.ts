import type {
  WorkforceMember,
  WorkforceModule,
} from "~/modules/workforce/types";
import {
  ADMIN,
  FACULTY,
  PRINCIPAL,
  DEPUTY_PRINCIPAL,
  TEACHER,
} from "./workforceMeta";

export const AMAR_BACCHUS: WorkforceMember = {
  id: "000",
  name: "Amar Bacchus",
  slug: "amar-bacchus",
  bio: "Amar Bacchus leads Bacchus Learning Centre with a vision for academic excellence and student success. As principal, he oversees all school operations and ensures the highest quality of education for all students.",
  quote: "Education is the foundation for a brighter future.",
  isPublic: true,
  contacts: [
    {
      type: "email",
      value: "amarbacchus@live.com",
      isPublic: true,
    },
    {
      type: "phone",
      value: "+592 681-0037",
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
};

export const CHERRILENE_BAXTER: WorkforceMember = {
  id: "001",
  name: "Cherrilene Baxter",
  slug: "cherrilene-baxter",
  bio: "Cherrilene Baxter serves as Deputy Principal, supporting the school's mission of providing quality education. She brings experience and dedication to ensuring student success and school operations.",
  quote: "Every child deserves the opportunity to excel.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: DEPUTY_PRINCIPAL,
      department: ADMIN,
    },
  ],
};

export const DENICIA_THOMAS: WorkforceMember = {
  id: "002",
  name: "Denicia Thomas",
  slug: "denicia-thomas",
  bio: "Denicia Thomas teaches Grade 10 students, preparing them for their final years of secondary education. She focuses on advanced academic skills and exam preparation.",
  quote: "Preparing students for their future is my greatest reward.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: TEACHER,
      department: FACULTY,
      titleOverride: "Grade 10 Teacher",
    },
  ],
  subjectAssignments: [
    { subject: "English", grades: ["Grade 10"] },
    { subject: "Math", grades: ["Grade 10"] },
    { subject: "Science", grades: ["Grade 10"] },
    { subject: "Social Studies", grades: ["Grade 10"] },
  ],
};

export const RENICIA_THOMAS: WorkforceMember = {
  id: "003",
  name: "Renicia Thomas",
  slug: "renicia-thomas",
  bio: "Renicia Thomas teaches Grades 7, 8, and 9, helping students transition from primary to secondary education. She emphasizes critical thinking and academic growth.",
  quote: "Building bridges between primary and secondary education.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: TEACHER,
      department: FACULTY,
      titleOverride: "Grades 7-9 Teacher",
    },
  ],
  subjectAssignments: [
    { subject: "English", grades: ["Grade 7", "Grade 8", "Grade 9"] },
    { subject: "Math", grades: ["Grade 7", "Grade 8", "Grade 9"] },
    { subject: "Science", grades: ["Grade 7", "Grade 8", "Grade 9"] },
    { subject: "Social Studies", grades: ["Grade 7", "Grade 8", "Grade 9"] },
  ],
};

export const TREVA_MEUSA: WorkforceMember = {
  id: "004",
  name: "Treva Meusa",
  slug: "treva-meusa",
  bio: "Treva Meusa teaches Grades 5 and 6, preparing students for the transition to secondary school. She focuses on building strong academic foundations.",
  quote: "Strong foundations lead to great achievements.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: TEACHER,
      department: FACULTY,
      titleOverride: "Grades 5-6 Teacher",
    },
  ],
  subjectAssignments: [
    { subject: "English", grades: ["Grade 5", "Grade 6"] },
    { subject: "Math", grades: ["Grade 5", "Grade 6"] },
    { subject: "Science", grades: ["Grade 5", "Grade 6"] },
    { subject: "Social Studies", grades: ["Grade 5", "Grade 6"] },
  ],
};

export const CLEANNA_LONDON: WorkforceMember = {
  id: "005",
  name: "Cleanna London",
  slug: "cleanna-london",
  bio: "Cleanna London teaches Grades 3 and 4, nurturing young minds and building essential academic skills. She creates engaging learning environments for her students.",
  quote: "Learning should be an adventure for every child.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: TEACHER,
      department: FACULTY,
      titleOverride: "Grades 3-4 Teacher",
    },
  ],
  subjectAssignments: [
    { subject: "English", grades: ["Grade 3", "Grade 4"] },
    { subject: "Math", grades: ["Grade 3", "Grade 4"] },
    { subject: "Science", grades: ["Grade 3", "Grade 4"] },
    { subject: "Social Studies", grades: ["Grade 3", "Grade 4"] },
  ],
};

export const KISHANA_BECKLES: WorkforceMember = {
  id: "006",
  name: "Kishana Beckles",
  slug: "kishana-beckles",
  bio: "Kishana Beckles teaches Grades 1 and 2, helping young students develop fundamental reading, writing, and math skills. She brings patience and creativity to early education.",
  quote: "Every child learns at their own pace, and that's perfectly fine.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: TEACHER,
      department: FACULTY,
      titleOverride: "Grades 1-2 Teacher",
    },
  ],
  subjectAssignments: [
    { subject: "English", grades: ["Grade 1", "Grade 2"] },
    { subject: "Math", grades: ["Grade 1", "Grade 2"] },
    { subject: "Science", grades: ["Grade 1", "Grade 2"] },
    { subject: "Social Studies", grades: ["Grade 1", "Grade 2"] },
  ],
};

export const BLOSSOM_JAMES: WorkforceMember = {
  id: "007",
  name: "Blossom James",
  slug: "blossom-james",
  bio: "Blossom James teaches nursery students, providing a nurturing environment for early childhood development. She specializes in play-based learning and social development.",
  quote: "Nurturing young minds to bloom and grow.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: TEACHER,
      department: FACULTY,
      titleOverride: "Nursery Teacher",
    },
  ],
  subjectAssignments: [
    { subject: "Early Literacy", grades: ["Nursery Year 1", "Nursery Year 2"] },
    { subject: "Early Math", grades: ["Nursery Year 1", "Nursery Year 2"] },
    { subject: "Art", grades: ["Nursery Year 1", "Nursery Year 2"] },
    {
      subject: "Social Development",
      grades: ["Nursery Year 1", "Nursery Year 2"],
    },
  ],
};

export const BACCHUS_LEARNING_WORKFORCE: WorkforceModule = {
  departments: [ADMIN, FACULTY],
  positions: [PRINCIPAL, DEPUTY_PRINCIPAL, TEACHER],
  teams: [],
  members: [
    AMAR_BACCHUS,
    CHERRILENE_BAXTER,
    DENICIA_THOMAS,
    RENICIA_THOMAS,
    TREVA_MEUSA,
    CLEANNA_LONDON,
    KISHANA_BECKLES,
    BLOSSOM_JAMES,
  ],
};
