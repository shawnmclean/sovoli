import type { Position, Department } from "~/modules/workforce/types";

// === Departments ===
export const ADMIN: Department = {
  name: "Administration",
  slug: "administration",
  description:
    "Handles all administrative, financial, and operational tasks of the school.",
  image: "/images/departments/administration.jpg",
  url: "/workforce/departments/administration",
};

export const FACULTY: Department = {
  name: "Faculty",
  slug: "faculty",
  description:
    "The academic team responsible for teaching and curriculum delivery.",
  image: "/images/departments/faculty.jpg",
  url: "/workforce/departments/faculty",
};

// === Positions ===
export const PRINCIPAL: Position = {
  name: "Principal",
  slug: "principal",
  description:
    "Leads the school and ensures academic and operational excellence.",
  image: "/images/positions/principal.jpg",
  url: "/workforce/positions/principal",
};

export const DEPUTY_PRINCIPAL: Position = {
  name: "Deputy Principal",
  slug: "deputy-principal",
  description:
    "Assists the principal in school operations and academic oversight.",
  image: "/images/positions/deputy-principal.jpg",
  url: "/workforce/positions/deputy-principal",
};

export const TEACHER: Position = {
  name: "Teacher",
  slug: "teacher",
  description: "Delivers classroom instruction and fosters student growth.",
  image: "/images/positions/teacher.jpg",
  url: "/workforce/positions/teacher",
};
