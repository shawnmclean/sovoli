"use client";

import React from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Badge } from "@sovoli/ui/components/badge";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Input } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { SearchIcon, XIcon } from "lucide-react";

import type { MemberData } from "../../membersData";
import { membersData } from "../../membersData";

// Get unique roles and departments
const uniqueRoles = [
  ...new Set(membersData.flatMap((faculty) => faculty.roles)),
].sort((a, b) => {
  // Sort roles alphabetically to ensure consistent order
  return a.localeCompare(b);
});
const uniqueDepartments = [
  ...new Set(membersData.flatMap((faculty) => faculty.departments)),
].sort((a, b) => a.localeCompare(b));

function FacultyCard({ faculty }: { faculty: MemberData }) {
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
          <p className="text-small text-default-500">
            {faculty.departments.join(", ")}
          </p>
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

          {faculty.courses?.length && faculty.courses.length > 0 && (
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
  const filteredFaculty = membersData.filter((faculty) => {
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.courses?.some(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.id.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesRole = selectedRole
      ? faculty.roles.includes(selectedRole)
      : true;
    const matchesDepartment = selectedDepartment
      ? faculty.departments.includes(selectedDepartment)
      : true;

    return matchesSearch && matchesRole && matchesDepartment;
  });

  // Group filtered faculty by role for display
  const groupedFaculty = filteredFaculty.reduce(
    (acc, faculty) => {
      // Handle each role in the roles array
      faculty.roles.forEach((role) => {
        if (!acc[role]) {
          acc[role] = [];
        }
        acc[role].push(faculty);
      });
      return acc;
    },
    {} as Record<string, MemberData[]>,
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
        <h1 className="text-4xl font-bold tracking-tight">Team Directory</h1>
        <p className="mt-4 text-lg text-default-500">
          Meet our dedicated team of educators and staff members
        </p>
      </div>

      {/* Filter section */}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-small font-medium">Search</label>
          <Input
            placeholder="Search by name, email, or bio..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<SearchIcon className="text-default-400" />}
            variant="bordered"
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
            variant="bordered"
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
            variant="bordered"
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

      {/* Results section */}
      <div>
        <div className="my-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Results{" "}
            <span className="text-default-500">({filteredFaculty.length})</span>
          </h2>
        </div>

        <Divider className="my-4" />

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
