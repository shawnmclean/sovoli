export interface MemberData {
  id: number;
  name: string;
  roles: string[];
  departments: string[];
  email: string;
  phone: string;
  bio: string;
  image: string;
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
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
  },
  {
    id: 12,
    name: "Nessa Bhagwandin",
    roles: ["Principal", "Teacher"],
    departments: ["Administration", "Faculty"],
    email: "sarah.johnson@school.edu",
    phone: "(555) 123-4567",
    bio: "Nessa has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
  },
  {
    id: 2,
    name: "Anita Dhaniram",
    roles: ["Principal", "Secretary", "Teacher"],
    departments: ["Administration", "Faculty"],
    email: "michael.thompson@school.edu",
    phone: "(555) 123-4568",
    bio: "Mr. Thompson oversees student discipline and supports the principal in day-to-day operations.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=2",
  },
  {
    id: 3,
    name: "Sir Chabeeraj Francis",
    roles: ["Teacher"],
    departments: ["Faculty"],
    email: "",
    phone: "",
    bio: "",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=3",
  },
  {
    id: 4,
    name: "Jessica A Gobin",
    roles: ["Teacher"],
    departments: ["Faculty"],
    email: "",
    phone: "",
    bio: "",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=4",
  },
  {
    id: 5,
    name: "Wonda Baron",
    roles: ["Teacher"],
    departments: ["Faculty"],
    email: "",
    phone: "",
    bio: "",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=5",
  },
  {
    id: 6,
    name: "Molta M. McRae",
    roles: ["Teacher"],
    departments: ["Faculty"],
    email: "",
    phone: "",
    bio: "",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=6",
  },
  {
    id: 7,
    name: "Samantha Persaud",
    roles: ["Teacher"],
    departments: ["Faculty"],
    email: "",
    phone: "",
    bio: "",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=7",
  },
];
