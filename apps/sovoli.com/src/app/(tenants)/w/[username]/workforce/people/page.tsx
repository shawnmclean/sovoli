"use client";

import React from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Input } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";

import type { MemberData } from "../../membersData";
import { membersData } from "../../membersData";

const uniqueRoles = [
  ...new Set(membersData.flatMap((faculty) => faculty.roles)),
].sort((a, b) => a.localeCompare(b));
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
            {faculty.roles.join(", ")}
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

  const filteredFaculty = membersData.filter((faculty) => {
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole
      ? faculty.roles.includes(selectedRole)
      : true;
    const matchesDepartment = selectedDepartment
      ? faculty.departments.includes(selectedDepartment)
      : true;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  return (
    <div className="container mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">
        Team Directory ({filteredFaculty.length})
      </h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-small font-medium">Search</label>
          <Input
            placeholder="Search by name, email, or bio..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>
        <div className="space-y-2">
          <label className="text-small font-medium">Role</label>
          <Select
            placeholder="All Roles"
            selectedKeys={selectedRole ? [selectedRole] : []}
            onSelectionChange={(keys) =>
              setSelectedRole(Array.from(keys)[0] as string)
            }
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
            onSelectionChange={(keys) =>
              setSelectedDepartment(Array.from(keys)[0] as string)
            }
          >
            {uniqueDepartments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <Divider className="my-4" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFaculty.map((faculty) => (
          <FacultyCard key={faculty.id} faculty={faculty} />
        ))}
      </div>
    </div>
  );
}
