"use client";

import React from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Input } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";

import type { OrgInstance } from "~/modules/organisations/types";
import type {
  Department,
  Position,
  WorkforceMember,
} from "~/modules/workforce/types";

interface TeamDirectoryProps {
  orgInstance: OrgInstance;
}

function FacultyCard({ member }: { member: WorkforceMember }) {
  return (
    <Card className="overflow-visible">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar
          src={member.image}
          name={member.name}
          className="h-16 w-16"
          isBordered
        />
        <div>
          <h3 className="text-xl font-semibold">{member.name}</h3>
          <p className="text-small text-default-500">
            {member.positions
              .map((position: Position) => position.name)
              .join(", ")}
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <p className="text-small">{member.bio ?? ""}</p>
          <div className="space-y-1 text-small">
            <p>
              <span className="font-medium">Email:</span> {member.email ?? ""}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {member.phone ?? ""}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function TeamDirectory({ orgInstance }: TeamDirectoryProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<string>("");
  const [selectedDepartment, setSelectedDepartment] =
    React.useState<string>("");

  const members = React.useMemo(
    () => orgInstance.workforceModule?.members ?? [],
    [orgInstance.workforceModule?.members],
  );

  const uniqueRoles = React.useMemo(() => {
    const roles = new Set<string>();
    members.forEach((member) => {
      member.positions.forEach((position: Position) => {
        roles.add(position.name);
      });
    });
    return Array.from(roles).sort((a, b) => a.localeCompare(b));
  }, [members]);

  const uniqueDepartments = React.useMemo(() => {
    const departments = new Set<string>();
    members.forEach((member) => {
      member.departments.forEach((dept: Department) => {
        departments.add(dept.name);
      });
    });
    return Array.from(departments).sort((a, b) => a.localeCompare(b));
  }, [members]);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (member.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesRole = selectedRole
      ? member.positions.some(
          (position: Position) => position.name === selectedRole,
        )
      : true;
    const matchesDepartment = selectedDepartment
      ? member.departments.some(
          (dept: Department) => dept.name === selectedDepartment,
        )
      : true;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  return (
    <div className="container mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">
        Team Directory ({filteredMembers.length})
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
        {filteredMembers.map((member) => (
          <FacultyCard key={member.slug} member={member} />
        ))}
      </div>
    </div>
  );
}
