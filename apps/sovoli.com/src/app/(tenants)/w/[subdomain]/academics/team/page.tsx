"use client";

import React from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Badge } from "@sovoli/ui/components/badge";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Input } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { SearchIcon, XIcon } from "lucide-react";

const facultyData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Principal",
    department: "Administration",
    email: "sarah.johnson@school.edu",
    phone: "(555) 123-4567",
    bio: "Dr. Johnson has been leading our school for over 10 years with a focus on academic excellence and student well-being.",
    image: "/placeholder.svg?height=100&width=100",
    courses: [
      {
        id: "ADM101",
        name: "School Leadership",
        schedule: "Mon/Wed 10:00-11:30",
        room: "Admin 101",
      },
    ],
  },
  {
    id: 2,
    name: "Michael Thompson",
    role: "Vice Principal",
    department: "Administration",
    email: "michael.thompson@school.edu",
    phone: "(555) 123-4568",
    bio: "Mr. Thompson oversees student discipline and supports the principal in day-to-day operations.",
    image: "/placeholder.svg?height=100&width=100",
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
    image: "/placeholder.svg?height=100&width=100",
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
    image: "/placeholder.svg?height=100&width=100",
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
    image: "/placeholder.svg?height=100&width=100",
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
    image: "/placeholder.svg?height=100&width=100",
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
    image: "/placeholder.svg?height=100&width=100",
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
    image: "/placeholder.svg?height=100&width=100",
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
    image: "/placeholder.svg?height=100&width=100",
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
    image: "/placeholder.svg?height=100&width=100",
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

// Get unique roles and departments
const uniqueRoles = Array.from(
  new Set(facultyData.map((faculty) => faculty.role)),
);
const uniqueDepartments = Array.from(
  new Set(facultyData.map((faculty) => faculty.department)),
);

interface FacultyMember {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
  courses: {
    id: string;
    name: string;
    schedule: string;
    room: string;
  }[];
}

function FacultyCard({ faculty }: { faculty: FacultyMember }) {
  return (
    <Card className="overflow-visible">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar
          src={faculty.image}
          name={faculty.name}
          className="h-16 w-16"
          isBordered
        />
        <div>
          <h3 className="text-xl font-semibold">{faculty.name}</h3>
          <p className="text-small text-default-500">{faculty.department}</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <p className="text-small">{faculty.bio}</p>
          <div className="space-y-1 text-small">
            <p>
              <span className="font-medium">Email:</span> {faculty.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {faculty.phone}
            </p>
          </div>

          {faculty.courses.length > 0 ? (
            <div className="mt-4">
              <h4 className="mb-2 text-small font-medium">Current Classes</h4>
              <div className="space-y-2">
                {faculty.courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-medium border-1 border-default-200 bg-default-50 p-2 text-tiny"
                  >
                    <div className="font-medium">
                      {course.name}{" "}
                      <span className="ml-1 text-default-500">
                        ({course.id})
                      </span>
                    </div>
                    <div className="mt-1 text-default-500">
                      <div>{course.schedule}</div>
                      <div>Room: {course.room}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 text-tiny text-default-500">
              Not currently teaching any classes
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<string>("");
  const [selectedDepartment, setSelectedDepartment] =
    React.useState<string>("");

  // Filter faculty based on search query, role, and department
  const filteredFaculty = facultyData.filter((faculty) => {
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.courses.some(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.id.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesRole = selectedRole ? faculty.role === selectedRole : true;
    const matchesDepartment = selectedDepartment
      ? faculty.department === selectedDepartment
      : true;

    return matchesSearch && matchesRole && matchesDepartment;
  });

  // Group filtered faculty by role for display
  const groupedFaculty = filteredFaculty.reduce(
    (acc, faculty) => {
      if (!acc[faculty.role]) {
        acc[faculty.role] = [];
      }
      acc[faculty.role]?.push(faculty);
      return acc;
    },
    {} as Record<string, FacultyMember[]>,
  );

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRole("");
    setSelectedDepartment("");
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedRole || selectedDepartment;

  return (
    <div className="container mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Faculty Directory</h1>
        <p className="mt-4 text-lg text-default-500">
          Meet our dedicated team of educators and staff members
        </p>
      </div>

      {/* Filter section */}
      <Card className="mb-8">
        <CardBody>
          <h2 className="mb-4 text-xl font-semibold">Filter Faculty</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-small font-medium">Search</label>
              <Input
                placeholder="Search by name, email, or bio..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={<SearchIcon className="text-default-400" />}
              />
            </div>

            <div className="space-y-2">
              <label className="text-small font-medium">Role</label>
              <Select
                placeholder="All Roles"
                selectedKeys={selectedRole ? [selectedRole] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedRole(selected);
                }}
              >
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-small font-medium">Department</label>
              <Select
                placeholder="All Departments"
                selectedKeys={selectedDepartment ? [selectedDepartment] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedDepartment(selected);
                }}
              >
                {uniqueDepartments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge
                    content={
                      <XIcon
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSearchQuery("")}
                      />
                    }
                    variant="flat"
                  >
                    Search: {searchQuery}
                  </Badge>
                )}
                {selectedRole && (
                  <Badge
                    content={
                      <XIcon
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedRole("")}
                      />
                    }
                    variant="flat"
                  >
                    Role: {selectedRole}
                  </Badge>
                )}
                {selectedDepartment && (
                  <Badge
                    content={
                      <XIcon
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedDepartment("")}
                      />
                    }
                    variant="flat"
                  >
                    Department: {selectedDepartment}
                  </Badge>
                )}
              </div>
              <Button variant="light" size="sm" onPress={resetFilters}>
                Clear All
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Results section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Results{" "}
            <span className="text-default-500">({filteredFaculty.length})</span>
          </h2>
        </div>

        {Object.keys(groupedFaculty).length > 0 ? (
          Object.entries(groupedFaculty).map(([role, facultyList]) => (
            <div key={role} className="mb-10">
              <h3 className="mb-4 text-lg font-medium">{role}s</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {facultyList.map((faculty) => (
                  <FacultyCard key={faculty.id} faculty={faculty} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <Card className="flex h-40 flex-col items-center justify-center text-center">
            <CardBody>
              <p className="text-lg font-medium">No faculty members found</p>
              <p className="text-default-500">Try adjusting your filters</p>
              <Button
                variant="bordered"
                className="mt-4"
                onPress={resetFilters}
              >
                Reset Filters
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
