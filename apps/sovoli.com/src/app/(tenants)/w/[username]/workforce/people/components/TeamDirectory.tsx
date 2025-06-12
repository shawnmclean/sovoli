"use client";

import React from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Input } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";

import type { OrgInstance } from "~/modules/organisations/types";
import type {
  OrgRoleAssignment,
  WorkforceMember,
} from "~/modules/workforce/types";
import { Link } from "@sovoli/ui/components/link";
import { MailIcon, PhoneIcon } from "lucide-react";

interface TeamDirectoryProps {
  orgInstance: OrgInstance;
}
function getContact(
  member: WorkforceMember,
  type: "email" | "phone",
): string | null {
  return (
    member.contacts?.find((c) => c.type === type && c.isPublic)?.value ?? null
  );
}

function getPrimaryRole(
  member: WorkforceMember,
): OrgRoleAssignment | undefined {
  return (
    member.roleAssignments.find((r) => r.isPrimary) ?? member.roleAssignments[0] // fallback to first
  );
}

function FacultyCard({ member }: { member: WorkforceMember }) {
  const primaryRole = getPrimaryRole(member);
  const displayTitle = primaryRole?.titleOverride ?? primaryRole?.position.name;

  return (
    <Card className="overflow-visible">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar
          src={member.image}
          name={member.name}
          className="h-20 w-20"
          isBordered
        />
        <div className="flex-grow">
          <Link
            href={`/workforce/people/${member.slug}`}
            color="foreground"
            underline="hover"
          >
            <h3 className="text-xl font-semibold">{member.name}</h3>
          </Link>
          {displayTitle && (
            <p className="text-small text-default-500">{displayTitle}</p>
          )}
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            {getContact(member, "email") && (
              <p className="flex items-center gap-1 text-xs text-default-500">
                <MailIcon className="h-3 w-3" />
                <a
                  href={`mailto:${getContact(member, "email")}`}
                  className="hover:underline"
                >
                  {getContact(member, "email")}
                </a>
              </p>
            )}
            {getContact(member, "phone") && (
              <p className="flex items-center gap-1 text-xs text-default-500">
                <PhoneIcon className="h-3 w-3" />
                <a
                  href={`tel:${getContact(member, "phone")}`}
                  className="hover:underline"
                >
                  {getContact(member, "phone")}
                </a>
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="space-y-4">
          {member.quote && (
            <>
              <blockquote className="text-small italic text-default-500">
                "{member.quote}"
              </blockquote>
              <Divider />
            </>
          )}
          <p className="text-small line-clamp-3">{member.bio}</p>
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
      member.roleAssignments.forEach((assignment) => {
        roles.add(assignment.position.name);
      });
    });
    return Array.from(roles).sort();
  }, [members]);

  const uniqueDepartments = React.useMemo(() => {
    const departments = new Set<string>();
    members.forEach((member) => {
      member.roleAssignments.forEach((assignment) => {
        if (assignment.department) departments.add(assignment.department.name);
      });
    });
    return Array.from(departments).sort();
  }, [members]);

  const filteredMembers = members.filter((member) => {
    const email = getContact(member, "email");
    const bio = member.bio ?? "";

    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole
      ? member.roleAssignments.some((r) => r.position.name === selectedRole)
      : true;

    const matchesDepartment = selectedDepartment
      ? member.roleAssignments.some(
          (r) => r.department?.name === selectedDepartment,
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
