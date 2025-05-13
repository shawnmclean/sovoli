export interface MemberData {
  id: number;
  name: string;
  role: string;
  department: string;
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
export const membersData = [
  {
    id: 1,
    name: "Timon Bhagwandin",
    role: "Principal",
    department: "Administration",
    email: "sarah.johnson@school.edu",
    phone: "(555) 123-4567",
    bio: "Timon has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
  },
  {
    id: 12,
    name: "Nessa Bhagwandin",
    role: "Principal",
    department: "Administration",
    email: "sarah.johnson@school.edu",
    phone: "(555) 123-4567",
    bio: "Nessa has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
  },
  {
    id: 2,
    name: "Michael Thompson",
    role: "Vice Principal",
    department: "Administration",
    email: "michael.thompson@school.edu",
    phone: "(555) 123-4568",
    bio: "Mr. Thompson oversees student discipline and supports the principal in day-to-day operations.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=2",
    courses: [
      {
        id: "ADM201",
        name: "Educational Administration",
        schedule: "Tue/Thu 1:00-2:30",
        room: "Admin 102",
      },
    ],
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    role: "Department Head",
    department: "Science",
    email: "emily.rodriguez@school.edu",
    phone: "(555) 123-4569",
    bio: "Dr. Rodriguez leads our science department with a passion for innovation and hands-on learning.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=3",
    courses: [
      {
        id: "SCI301",
        name: "Advanced Biology",
        schedule: "Mon/Wed/Fri 9:00-10:30",
        room: "Science 301",
      },
      {
        id: "SCI401",
        name: "Research Methods",
        schedule: "Tue/Thu 11:00-12:30",
        room: "Lab 2",
      },
    ],
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Department Head",
    department: "Mathematics",
    email: "james.wilson@school.edu",
    phone: "(555) 123-4570",
    bio: "Mr. Wilson brings 15 years of experience to our mathematics department.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=4",
    courses: [
      {
        id: "MATH401",
        name: "Calculus II",
        schedule: "Mon/Wed/Fri 11:00-12:30",
        room: "Math 201",
      },
      {
        id: "MATH302",
        name: "Statistics",
        schedule: "Tue/Thu 2:00-3:30",
        room: "Math 105",
      },
    ],
  },
  {
    id: 5,
    name: "Lisa Chen",
    role: "Teacher",
    department: "English",
    email: "lisa.chen@school.edu",
    phone: "(555) 123-4571",
    bio: "Ms. Chen specializes in American literature and creative writing.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
    courses: [
      {
        id: "ENG201",
        name: "American Literature",
        schedule: "Mon/Wed/Fri 8:00-9:30",
        room: "English 102",
      },
      {
        id: "ENG305",
        name: "Creative Writing",
        schedule: "Tue/Thu 10:00-11:30",
        room: "English 105",
      },
    ],
  },
  {
    id: 6,
    name: "Robert Davis",
    role: "Teacher",
    department: "History",
    email: "robert.davis@school.edu",
    phone: "(555) 123-4572",
    bio: "Mr. Davis makes history come alive through interactive lessons and field trips.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
    courses: [
      {
        id: "HIST101",
        name: "World History",
        schedule: "Mon/Wed/Fri 10:00-11:30",
        room: "History 101",
      },
      {
        id: "HIST205",
        name: "American History",
        schedule: "Tue/Thu 1:00-2:30",
        room: "History 103",
      },
    ],
  },
  {
    id: 7,
    name: "Jennifer Martinez",
    role: "Teacher",
    department: "Science",
    email: "jennifer.martinez@school.edu",
    phone: "(555) 123-4573",
    bio: "Ms. Martinez specializes in biology and environmental science.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
    courses: [
      {
        id: "SCI101",
        name: "Biology",
        schedule: "Mon/Wed/Fri 9:00-10:30",
        room: "Science 101",
      },
      {
        id: "SCI205",
        name: "Environmental Science",
        schedule: "Tue/Thu 2:00-3:30",
        room: "Science 205",
      },
    ],
  },
  {
    id: 8,
    name: "David Kim",
    role: "Teacher",
    department: "Mathematics",
    email: "david.kim@school.edu",
    phone: "(555) 123-4574",
    bio: "Mr. Kim teaches algebra and calculus with a focus on real-world applications.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
    courses: [
      {
        id: "MATH101",
        name: "Algebra I",
        schedule: "Mon/Wed/Fri 8:00-9:30",
        room: "Math 101",
      },
      {
        id: "MATH301",
        name: "Calculus I",
        schedule: "Tue/Thu 11:00-12:30",
        room: "Math 201",
      },
    ],
  },
  {
    id: 9,
    name: "Patricia Brown",
    role: "Counselor",
    department: "Student Services",
    email: "patricia.brown@school.edu",
    phone: "(555) 123-4575",
    bio: "Ms. Brown provides academic and personal counseling to help students succeed.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
    courses: [],
  },
  {
    id: 10,
    name: "Thomas Garcia",
    role: "Librarian",
    department: "Library",
    email: "thomas.garcia@school.edu",
    phone: "(555) 123-4576",
    bio: "Mr. Garcia manages our extensive library collection and helps students with research projects.",
    image: "https://img.heroui.chat/image/avatar?w=200&h=200&u=1",
    courses: [
      {
        id: "LIB101",
        name: "Research Skills",
        schedule: "Fri 1:00-2:30",
        room: "Library Lab",
      },
    ],
  },
];
