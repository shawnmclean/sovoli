import type { Department, Position } from "~/modules/workforce/types";

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

export const SUPPORT: Department = {
  name: "Support Staff",
  slug: "support-staff",
  description:
    "Our caring support team that ensures a safe and nurturing environment.",
  image: "/images/departments/support.jpg",
  url: "/workforce/departments/support-staff",
};

// === Positions ===
export const PRINCIPAL: Position = {
  name: "Principal",
  slug: "principal",
  description:
    "Leads the school and ensures academic and operational excellence in early childhood education.",
  image: "/images/positions/principal.jpg",
  url: "/workforce/positions/principal",
};

export const NURSERY_TEACHER: Position = {
  name: "Nursery Teacher",
  slug: "nursery-teacher",
  description:
    "Specialized in early childhood development and play-based learning.",
  image: "/images/positions/nursery-teacher.jpg",
  url: "/workforce/positions/nursery-teacher",
};

export const TEACHING_ASSISTANT: Position = {
  name: "Teaching Assistant",
  slug: "teaching-assistant",
  description:
    "Supports teachers and students with care and dedication in the classroom.",
  image: "/images/positions/teaching-assistant.jpg",
  url: "/workforce/positions/teaching-assistant",
};

export const CARETAKER: Position = {
  name: "Caretaker",
  slug: "caretaker",
  description:
    "Maintains school facilities to ensure a clean and safe environment.",
  image: "/images/positions/caretaker.jpg",
  url: "/workforce/positions/caretaker",
};
