import type {
  WorkforceMember,
  WorkforceModule,
} from "~/modules/workforce/types";
import {
  ADMIN,
  FACULTY,
  PRINCIPAL,
  TEACHER,
  SECRETARY,
  DIRECTOR_OF_STUDIES,
} from "./workforceMeta";

export const SIR_CHABEERAJ_FRANCIS: WorkforceMember = {
  id: "003",
  name: "Sir Chabeeraj Francis",
  slug: "sir-chabeeraj-francis",
  bio: "Sir Chabeeraj believes education is the most powerful tool to transform lives. A medical scholar and university student himself, he draws from both academic and real-world experiences to teach students how knowledge can elevate them beyond perceived limits. His scholarship to China and degree in medicine were earned through perseverance, and now he channels that same drive into guiding students toward academic and personal excellence. With a passion for health education, he hopes to shape planetary wellbeing by starting at the grassroots—our schools.",
  quote: "Knowledge gained is knowledge shared.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: DIRECTOR_OF_STUDIES,
      department: FACULTY,
      titleOverride: "Director of Studies & Secondary Teacher",
    },
  ],
  subjectAssignments: [
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
};

export const ANITA_DHANIRAM: WorkforceMember = {
  id: "003",
  name: "Anita Dhaniram",
  slug: "anita-dhaniram",
  image: "/images/orgs/private-schools/guyana/modernacademy/team/anita.webp",
  bio: "Anita supports all administrative operations and keeps the school running smoothly.",
  quote:
    "At Modern Academy, we are like a parent to your child—it's a home away from home.",
  isPublic: true,
  contacts: [
    {
      type: "email",
      value: "anita@ma.edu.gy",
      isPublic: true,
    },
    {
      type: "phone",
      value: "+592 646-4069",
      isPublic: true,
    },
  ],
  roleAssignments: [
    {
      position: SECRETARY,
      department: ADMIN,
    },
    {
      position: TEACHER,
      department: FACULTY,
    },
  ],
};

export const JESSICA_GOBIN: WorkforceMember = {
  id: "005",
  name: "Jessica A Gobin",
  slug: "jessica-a-gobin",
  image: "/images/orgs/private-schools/guyana/modernacademy/team/jessica.webp",
  bio: "Jessica has a natural gift for connecting with children. Previously in office work, she quickly realized her calling was in the classroom, where her calm energy, playful nature, and deep empathy draw children to her. Whether it's singing nursery rhymes, conducting simple science experiments, or guiding early literacy, she makes learning feel like magic. Her connection with kids is mutual—uplifting her spirit as much as she nurtures theirs.",
  quote:
    "All kids need is a little help, a little hope and somebody who believes. — Magic Johnson",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: TEACHER,
      department: FACULTY,
      titleOverride: "Nursery Year 2 Teacher",
    },
  ],
  subjectAssignments: [
    { subject: "Math", grades: ["Nursery Year 2"] },
    { subject: "English", grades: ["Nursery Year 2"] },
    { subject: "Science", grades: ["Nursery Year 2"] },
    { subject: "Social Studies", grades: ["Nursery Year 2"] },
    { subject: "Art", grades: ["Nursery Year 2"] },
  ],
};

export const WONDA_BARON: WorkforceMember = {
  id: "006",
  name: "Wonda Baron",
  slug: "wonda-baron",
  image: "/images/orgs/private-schools/guyana/modernacademy/team/wonda.webp",
  bio: "Wonda has dreamed of being a teacher since childhood and followed that passion with commitment. Though she explored other jobs, her heart always led her back to the classroom. As a mother herself, she brings both structure and warmth to her teaching, using motivational quotes and playful methods to make learning fun. Her students love her—even when she's strict—and often don't want her to miss a day. With a keen eye for student progress, she tailors her approach to every learner's needs and helps lift every child to their full potential.",
  quote:
    "Every child learns differently—my role is to meet them where they are and guide them forward.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: TEACHER,
      department: FACULTY,
      titleOverride: "Grade 1 & 2 Teacher",
    },
  ],
  subjectAssignments: [
    { subject: "Math", grades: ["Grade 1", "Grade 2"] },
    { subject: "English", grades: ["Grade 1", "Grade 2"] },
    { subject: "Science", grades: ["Grade 1", "Grade 2"] },
    { subject: "Social Studies", grades: ["Grade 1", "Grade 2"] },
  ],
};

export const MOLTA_MCRAE: WorkforceMember = {
  id: "007",
  name: "Molta M. McRae",
  slug: "molta-mcrae",
  image: "/images/orgs/private-schools/guyana/modernacademy/team/molta.webp",
  bio: "With over two decades of teaching experience, Molta has become a trusted mentor to students and parents alike. Her classrooms are rooted in love, discipline, and unwavering care. Understanding the complex realities children face—especially those from single-parent homes—she steps in with compassion and structure, serving as a second parent. Her deep relationships with families allow her to support students holistically and guide them toward emotional and academic success.",
  quote:
    "Always be there for your kids. Children require attention—Miss alone cannot do it.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: TEACHER,
      department: FACULTY,
      titleOverride: "Grade 3 & 4 Teacher",
    },
  ],
  subjectAssignments: [
    { subject: "Math", grades: ["Grade 3", "Grade 4"] },
    { subject: "English", grades: ["Grade 3", "Grade 4"] },
    { subject: "Science", grades: ["Grade 3", "Grade 4"] },
    { subject: "Social Studies", grades: ["Grade 3", "Grade 4"] },
  ],
};

export const SAMANTHA_PERSAUD: WorkforceMember = {
  id: "008",
  name: "Samantha Persaud",
  slug: "samantha-persaud",
  image: "/images/orgs/private-schools/guyana/modernacademy/team/samantha.webp",
  bio: "Samantha is a grounded and focused educator whose quiet strength creates a peaceful classroom environment. She believes in nurturing the whole child and leads with a gentle authority that makes her approachable and respected. While her profile is still being fully built, Samantha continues to make a lasting impact through her calm presence and commitment to student success.",
  isPublic: true,
  contacts: [],
  roleAssignments: [
    {
      position: TEACHER,
      department: FACULTY,
    },
  ],
};

export const MODERN_ACADEMY_WORKFORCE: WorkforceModule = {
  departments: [ADMIN, FACULTY],
  positions: [PRINCIPAL, TEACHER, SECRETARY, DIRECTOR_OF_STUDIES],
  teams: [],
  members: [
    {
      id: "000",
      name: "Luke Anderson Simon",
      slug: "luke-anderson-simon",
      image: undefined,
      bio: "Luke is a retired headmaster with over 40 years of experience in education. He is a mentor to the current staff and a source of wisdom for the students.",
      isPublic: true,
      contacts: [],
      roleAssignments: [
        {
          position: PRINCIPAL,
          department: ADMIN,
          isPrimary: true,
        },
      ],
    },
    {
      id: "002",
      name: "Nessa Bhagwandin",
      slug: "nessa-bhagwandin",
      image: undefined,
      bio: "Nessa has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
      isPublic: true,
      contacts: [
        {
          type: "email",
          value: "nessa@ma.edu.gy",
          isPublic: true,
        },
        {
          type: "phone",
          value: "+592 751-3788",
          isPublic: true,
        },
      ],
      roleAssignments: [
        {
          position: DIRECTOR_OF_STUDIES,
          department: ADMIN,
          isPrimary: true,
        },
      ],
    },
    SIR_CHABEERAJ_FRANCIS,
    ANITA_DHANIRAM,
    JESSICA_GOBIN,
    WONDA_BARON,
    MOLTA_MCRAE,
    SAMANTHA_PERSAUD,
  ],
};
