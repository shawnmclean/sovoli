import type {
  Department,
  Position,
  WorkforceModule,
  WorkforceMember,
  OrgRoleAssignment,
  SubjectAssignment,
} from "~/modules/workforce/types";
import type { Contact } from "~/modules/core/types";
import { ADMIN, FACULTY, PRINCIPAL, TEACHER, SECRETARY } from "./workforceMeta";

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
  subjectAssignments?: SubjectAssignment[],
): WorkforceMember & { subjectAssignments?: SubjectAssignment[] } {
  return {
    id,
    slug,
    name,
    image,
    bio,
    contacts,
    roleAssignments,
    subjectAssignments,
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
        contact("phone", "+592 627-1915", { isPublic: true }),
      ],
      undefined,
      "Joel has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
    ),
    member(
      "002",
      "Nessa Bhagwandin",
      "nessa-bhagwandin",
      [assign(PRINCIPAL, ADMIN, { isPrimary: true }), assign(TEACHER, FACULTY)],
      [
        contact("email", "nessa@ma.edu.gy", { isPublic: true }),
        contact("phone", "+592 751-3788", { isPublic: true }),
      ],
      undefined,
      "Nessa has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
    ),
    member(
      "003",
      "Anita Dhaniram",
      "anita-dhaniram",
      [assign(SECRETARY, ADMIN)],
      [contact("email", "anita@ma.edu.gy"), contact("phone", "+592 646-4069")],
      "/images/profile/anita.jpeg",
      "Anita supports all administrative operations and keeps the school running smoothly.",
    ),
    member(
      "004",
      "Sir Chabeeraj Francis",
      "sir-chabeeraj-francis",
      [
        assign(TEACHER, FACULTY, {
          titleOverride: "Grades 3–6 & Secondary Teacher",
        }),
      ],
      [],
      "/images/profile/chabeeraj.jpeg",
      "Sir Chabeeraj brings academic excellence and real-world health awareness to his students.",
      [
        {
          subject: "English",
          grades: ["Grade 3", "Grade 4", "Grade 5", "Grade 6", "Secondary"],
        },
        {
          subject: "Math",
          grades: ["Grade 3", "Grade 4", "Grade 5", "Grade 6", "Secondary"],
        },
        {
          subject: "Science",
          grades: ["Grade 3", "Grade 4", "Grade 5", "Grade 6", "Secondary"],
        },
        {
          subject: "Social Studies",
          grades: ["Grade 3", "Grade 4", "Grade 5", "Grade 6", "Secondary"],
        },
        { subject: "Information Technology", grades: ["Secondary"] },
        { subject: "Health & Family Life Education", grades: ["Secondary"] },
        { subject: "Human & Social Biology", grades: ["Secondary"] },
        { subject: "Principles of Business", grades: ["Secondary"] },
        { subject: "Office Administration", grades: ["Secondary"] },
        { subject: "Geography", grades: ["Secondary"] },
      ],
    ),
    member(
      "005",
      "Jessica A Gobin",
      "jessica-a-gobin",
      [assign(TEACHER, FACULTY, { titleOverride: "Nursery Year 2 Teacher" })],
      [],
      "/images/profile/jessica.jpeg",
      "Jessica nurtures young learners through creative play, phonics, and foundational skills.",
      [
        { subject: "Math", grades: ["Nursery Year 2"] },
        { subject: "English", grades: ["Nursery Year 2"] },
        { subject: "Science", grades: ["Nursery Year 2"] },
        { subject: "Social Studies", grades: ["Nursery Year 2"] },
        { subject: "Art", grades: ["Nursery Year 2"] },
      ],
    ),
    member(
      "006",
      "Wonda Baron",
      "wonda-baron",
      [assign(TEACHER, FACULTY, { titleOverride: "Grade 1 & 2 Teacher" })],
      [],
      "/images/profile/wonda.jpeg",
      "Wonda is known for her energetic, structured classrooms and child-centered teaching style.",
      [
        { subject: "Math", grades: ["Grade 1", "Grade 2"] },
        { subject: "English", grades: ["Grade 1", "Grade 2"] },
        { subject: "Science", grades: ["Grade 1", "Grade 2"] },
        { subject: "Social Studies", grades: ["Grade 1", "Grade 2"] },
      ],
    ),
    member(
      "007",
      "Molta M. McRae",
      "molta-mcrae",
      [assign(TEACHER, FACULTY, { titleOverride: "Grade 3 & 4 Teacher" })],
      [],
      "/images/profile/molta.jpeg",
      "Molta brings decades of teaching experience and a deep care for students’ development.",
      [
        { subject: "Math", grades: ["Grade 3", "Grade 4"] },
        { subject: "English", grades: ["Grade 3", "Grade 4"] },
        { subject: "Science", grades: ["Grade 3", "Grade 4"] },
        { subject: "Social Studies", grades: ["Grade 3", "Grade 4"] },
      ],
    ),
    member(
      "008",
      "Samantha Persaud",
      "samantha-persaud",
      [assign(TEACHER, FACULTY)],
      [],
      "/images/profile/samantha.jpeg",
      "Samantha brings a calm and focused presence to every classroom she enters.",
    ),
  ],
};
