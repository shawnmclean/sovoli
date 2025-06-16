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

export const DIRECTOR_OF_STUDIES: Position = {
  name: "Director of Studies",
  slug: "director-of-studies",
  description:
    "Oversees the academic program and ensures the school's curriculum is aligned with the national standards.",
  image: "/images/positions/director-of-studies.jpg",
  url: "/workforce/positions/director-of-studies",
};

export const TEACHER: Position = {
  name: "Teacher",
  slug: "teacher",
  description: "Delivers classroom instruction and fosters student growth.",
  image: "/images/positions/teacher.jpg",
  url: "/workforce/positions/teacher",
};

export const SECRETARY: Position = {
  name: "Secretary",
  slug: "secretary",
  description: "Supports administrative tasks and maintains school records.",
  image: "/images/positions/secretary.jpg",
  url: "/workforce/positions/secretary",
};
