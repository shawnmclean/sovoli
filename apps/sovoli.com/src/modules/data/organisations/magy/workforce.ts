import type {
  Department,
  Position,
  WorkforceModule,
  WorkforceMember,
  OrgRoleAssignment,
} from "~/modules/workforce/types";
import type { Contact } from "~/modules/core/types";

// === Departments ===
const ADMIN: Department = {
  name: "Administration",
  slug: "administration",
  description:
    "Handles all administrative, financial, and operational tasks of the school.",
  image: "/images/departments/administration.jpg",
  url: "/workforce/departments/administration",
};

const FACULTY: Department = {
  name: "Faculty",
  slug: "faculty",
  description:
    "The academic team responsible for teaching and curriculum delivery.",
  image: "/images/departments/faculty.jpg",
  url: "/workforce/departments/faculty",
};

// === Positions ===
const PRINCIPAL: Position = {
  name: "Principal",
  slug: "principal",
  description:
    "Leads the school and ensures academic and operational excellence.",
  image: "/images/positions/principal.jpg",
  url: "/workforce/positions/principal",
};

const TEACHER: Position = {
  name: "Teacher",
  slug: "teacher",
  description: "Delivers classroom instruction and fosters student growth.",
  image: "/images/positions/teacher.jpg",
  url: "/workforce/positions/teacher",
};

const SECRETARY: Position = {
  name: "Secretary",
  slug: "secretary",
  description: "Supports administrative tasks and maintains school records.",
  image: "/images/positions/secretary.jpg",
  url: "/workforce/positions/secretary",
};

// === Helpers ===
function contact(
  type: Contact["type"],
  value: string,
  opts?: { label?: string; isPublic?: boolean },
): Contact {
  return {
    type,
    value,
    label: opts?.label,
    isPublic: opts?.isPublic ?? true,
  };
}

function assign(
  position: Position,
  department: Department,
  opts?: Partial<OrgRoleAssignment>,
): OrgRoleAssignment {
  return {
    position,
    department,
    ...opts,
  };
}

function member(
  id: string,
  name: string,
  slug: string,
  roleAssignments: OrgRoleAssignment[],
  contacts: Contact[] = [],
  image?: string,
  bio?: string,
): WorkforceMember {
  return {
    id,
    slug,
    name,
    image,
    bio,
    contacts,
    roleAssignments,
    isPublic: true,
  };
}

// === Workforce Data ===
export const MODERN_ACADEMY_WORKFORCE: WorkforceModule = {
  departments: [ADMIN, FACULTY],
  positions: [PRINCIPAL, TEACHER, SECRETARY],
  teams: [],
  members: [
    member(
      "001",
      "Joel Bhagwandin",
      "joel-bhagwandin",
      [assign(PRINCIPAL, ADMIN, { isPrimary: true })],
      [
        contact("email", "joel@ma.edu.gy", { label: "Work", isPublic: true }),
        contact("phone", "(555) 123-4567", { isPublic: false }), // private phone
      ],
      undefined,
      "Timon has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
    ),
    member(
      "002",
      "Nessa Bhagwandin",
      "nessa-bhagwandin",
      [assign(PRINCIPAL, ADMIN, { isPrimary: true }), assign(TEACHER, FACULTY)],
      [
        contact("email", "nessa@school.edu", { isPublic: true }),
        contact("phone", "(555) 123-4567", { isPublic: true }),
      ],
      undefined,
      "Nessa has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
    ),
    member(
      "003",
      "Anita Dhaniram",
      "anita-dhaniram",
      [assign(SECRETARY, ADMIN)],
      [
        contact("email", "anita@school.edu"),
        contact("phone", "(555) 123-4568", { isPublic: true }),
      ],
      "/images/profile/anita.jpeg",
      "Mr. Thompson oversees student discipline and supports the principal in day-to-day operations.",
    ),
    member("004", "Sir Chabeeraj Francis", "sir-chabeeraj-francis", [
      assign(TEACHER, FACULTY),
    ]),
    member(
      "005",
      "Jessica A Gobin",
      "jessica-a-gobin",
      [assign(TEACHER, FACULTY)],
      [],
      "/images/profile/jessica.jpeg",
    ),
    member(
      "006",
      "Wonda Baron",
      "wonda-baron",
      [assign(TEACHER, FACULTY)],
      [],
      "/images/profile/wonda.jpeg",
    ),
    member(
      "007",
      "Molta M. McRae",
      "molta-mcrae",
      [assign(TEACHER, FACULTY)],
      [],
      "/images/profile/molta.jpeg",
    ),
    member(
      "008",
      "Samantha Persaud",
      "samantha-persaud",
      [assign(TEACHER, FACULTY)],
      [],
      "/images/profile/samantha.jpeg",
    ),
  ],
};
