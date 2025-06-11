import type {
  Department,
  Position,
  WorkforceModule,
} from "~/modules/workforce/types";

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

export const MODERN_ACADEMY_WORKFORCE: WorkforceModule = {
  members: [
    {
      name: "Joel Bhagwandin",
      slug: "joel-bhagwandin",
      departments: [ADMIN],
      teams: [],
      positions: [PRINCIPAL],
      email: "sarah.johnson@school.edu",
      phone: "(555) 123-4567",
      bio: "Timon has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
    },
    {
      name: "Nessa Bhagwandin",
      slug: "nessa-bhagwandin",
      departments: [ADMIN, FACULTY],
      teams: [],
      positions: [PRINCIPAL, TEACHER],
      email: "sarah.johnson@school.edu",
      phone: "(555) 123-4567",
      bio: "Nessa has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
    },
    {
      name: "Anita Dhaniram",
      slug: "anita-dhaniram",
      departments: [ADMIN],
      teams: [],
      positions: [SECRETARY],
      email: "michael.thompson@school.edu",
      phone: "(555) 123-4568",
      bio: "Mr. Thompson oversees student discipline and supports the principal in day-to-day operations.",
      image: "/images/profile/anita.jpeg",
    },
    {
      name: "Sir Chabeeraj Francis",
      slug: "sir-chabeeraj-francis",
      departments: [FACULTY],
      teams: [],
      positions: [TEACHER],
      email: "",
      phone: "",
      bio: "",
    },
    {
      name: "Jessica A Gobin",
      slug: "jessica-a-gobin",
      departments: [FACULTY],
      teams: [],
      positions: [TEACHER],
      email: "",
      phone: "",
      bio: "",
      image: "/images/profile/jessica.jpeg",
    },
    {
      name: "Wonda Baron",
      slug: "wonda-baron",
      departments: [FACULTY],
      teams: [],
      positions: [TEACHER],
      email: "",
      phone: "",
      bio: "",
      image: "/images/profile/wonda.jpeg",
    },
    {
      name: "Molta M. McRae",
      slug: "molta-mcrae",
      departments: [FACULTY],
      teams: [],
      positions: [TEACHER],
      email: "",
      phone: "",
      bio: "",
      image: "/images/profile/molta.jpeg",
    },
    {
      name: "Samantha Persaud",
      slug: "samantha-persaud",
      departments: [FACULTY],
      teams: [],
      positions: [TEACHER],
      email: "",
      phone: "",
      bio: "",
      image: "/images/profile/samantha.jpeg",
    },
  ],
};
