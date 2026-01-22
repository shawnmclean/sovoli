"use client";

import { Avatar } from "@sovoli/ui/components/avatar";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Input } from "@sovoli/ui/components/input";
import { Link } from "@sovoli/ui/components/link";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { MailIcon, PhoneIcon } from "lucide-react";
import React from "react";
import type { OrgInstance } from "~/modules/organisations/types";
import type { WorkforceMember } from "~/modules/workforce/types";
import {
  filterWorkforceMembers,
  getMemberDisplayTitle,
  getPublicContactValue,
  getUniqueDepartmentNames,
  getUniqueRoleNames,
} from "~/modules/workforce/utils";

interface TeamDirectoryProps {
  orgInstance: OrgInstance;
}

function FacultyCard({ member }: { member: WorkforceMember }) {
  const displayTitle = getMemberDisplayTitle(member);
  const email = getPublicContactValue(member, "email");
  const phone = getPublicContactValue(member, "phone");

  return (
    <Card className="overflow-visible">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar
          src={member.photo?.url}
          name={member.name}
          className="h-20 w-20"
          isBordered
        />
        <div className="flex-grow">
          <Link
            href={`/workforce/people/${member.slug}`}
            color="foreground"
            underline="always"
          >
            <h3 className="text-xl font-semibold">{member.name}</h3>
          </Link>
          {displayTitle && (
            <p className="text-small text-default-500">{displayTitle}</p>
          )}
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            {email && (
              <p className="flex items-center gap-1 text-xs text-default-500">
                <MailIcon className="h-3 w-3" />
                <a href={`mailto:${email}`} className="hover:underline">
                  {email}
                </a>
              </p>
            )}
            {phone && (
              <p className="flex items-center gap-1 text-xs text-default-500">
                <PhoneIcon className="h-3 w-3" />
                <a href={`tel:${phone}`} className="hover:underline">
                  {phone}
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

  const uniqueRoles = React.useMemo(
    () => getUniqueRoleNames(members),
    [members],
  );

  const uniqueDepartments = React.useMemo(
    () => getUniqueDepartmentNames(members),
    [members],
  );

  const filteredMembers = React.useMemo(
    () =>
      filterWorkforceMembers({
        members,
        searchQuery,
        selectedRole,
        selectedDepartment,
      }),
    [members, searchQuery, selectedRole, selectedDepartment],
  );

  return (
    <div className="container mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">
        Team Directory ({filteredMembers.length})
      </h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label
            htmlFor="team-directory-search"
            className="text-small font-medium"
          >
            Search
          </label>
          <Input
            id="team-directory-search"
            placeholder="Search by name, email, or bio..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="team-directory-role"
            className="text-small font-medium"
          >
            Role
          </label>
          <Select
            id="team-directory-role"
            placeholder="All Roles"
            selectedKeys={selectedRole ? [selectedRole] : []}
            onSelectionChange={(keys) =>
              setSelectedRole(Array.from(keys)[0] as string)
            }
          >
            {uniqueRoles.map((role) => (
              <SelectItem key={role}>{role}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="team-directory-department"
            className="text-small font-medium"
          >
            Department
          </label>
          <Select
            id="team-directory-department"
            placeholder="All Departments"
            selectedKeys={selectedDepartment ? [selectedDepartment] : []}
            onSelectionChange={(keys) =>
              setSelectedDepartment(Array.from(keys)[0] as string)
            }
          >
            {uniqueDepartments.map((department) => (
              <SelectItem key={department}>{department}</SelectItem>
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
