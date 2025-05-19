export interface MemberData {
  id: number;
  name: string;
  roles: string[];
  departments: string[];
  email: string;
  phone: string;
  bio: string;
  image?: string;
  courses?: {
    id: string;
    name: string;
    schedule: string;
    room: string;
  }[];
}

export const membersData: MemberData[] = [
  {
    id: 1,
    name: "Timon Bhagwandin",
    roles: ["Principal"],
    departments: ["Administration"],
    email: "sarah.johnson@school.edu",
    phone: "(555) 123-4567",
    bio: "Timon has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
  },
  {
    id: 12,
    name: "Nessa Bhagwandin",
    roles: ["Principal", "Teacher"],
    departments: ["Administration", "Faculty"],
    email: "sarah.johnson@school.edu",
    phone: "(555) 123-4567",
    bio: "Nessa has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
  },
  {
    id: 2,
    name: "Anita Dhaniram",
    roles: ["Secretary", "Teacher"],
    departments: ["Administration", "Faculty"],
    email: "michael.thompson@school.edu",
    phone: "(555) 123-4568",
    bio: "Mr. Thompson oversees student discipline and supports the principal in day-to-day operations.",
    image: "/images/profile/anita.jpeg",
  },
  {
    id: 3,
    name: "Sir Chabeeraj Francis",
    roles: ["Teacher"],
    departments: ["Faculty"],
    email: "",
    phone: "",
    bio: "",

    courses: [
      {
        id: "1",
        name: "Elementary Education",
        schedule: "8:00 am - 5:00 pm",
        room: "101",
      },
      {
        id: "2",
        name: "Elementary Education",
        schedule: "8:00 am - 5:00 pm",
        room: "102",
      },
      {
        id: "3",
        name: "Elementary Education",
        schedule: "8:00 am - 5:00 pm",
        room: "103",
      },
    ],
  },
  {
    id: 4,
    name: "Jessica A Gobin",
    roles: ["Teacher"],
    departments: ["Faculty"],
    email: "",
    phone: "",
    bio: "",
    image: "/images/profile/jessica.jpeg",
  },
  {
    id: 5,
    name: "Wonda Baron",
    roles: ["Teacher"],
    departments: ["Faculty"],
    email: "",
    phone: "",
    bio: "",
    image: "/images/profile/wonda.jpeg",
  },
  {
    id: 6,
    name: "Molta M. McRae",
    roles: ["Teacher"],
    departments: ["Faculty"],
    email: "",
    phone: "",
    bio: "",
    image: "/images/profile/molta.jpeg",
  },
  {
    id: 7,
    name: "Samantha Persaud",
    roles: ["Teacher"],
    departments: ["Faculty"],
    email: "",
    phone: "",
    bio: "",
    image: "/images/profile/samantha.jpeg",
  },
];
