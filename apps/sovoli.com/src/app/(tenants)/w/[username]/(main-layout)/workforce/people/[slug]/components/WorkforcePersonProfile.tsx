import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type {
  WorkforceMember,
  OrgRoleAssignment,
} from "~/modules/workforce/types";
import { SubjectAssignments } from "./SubjectAssignments";

interface WorkforcePersonProfileProps {
  member: WorkforceMember;
}

function getPublicContact(member: WorkforceMember, type: "email" | "phone") {
  return (
    member.contacts?.find((c) => c.type === type && c.isPublic)?.value ?? ""
  );
}

function getPrimaryRole(
  member: WorkforceMember,
): OrgRoleAssignment | undefined {
  return (
    member.roleAssignments.find((r) => r.isPrimary) ?? member.roleAssignments[0]
  );
}

export function WorkforcePersonProfile({
  member,
}: WorkforcePersonProfileProps) {
  const roles = member.roleAssignments;
  const email = getPublicContact(member, "email");
  const phone = getPublicContact(member, "phone");

  const primaryRole = getPrimaryRole(member);
  const displayTitle = primaryRole?.titleOverride ?? primaryRole?.position.name;

  const departmentNames = Array.from(
    new Set(roles.map((r) => r.department?.name).filter(Boolean)),
  );

  return (
    <div className="container mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <Button
          as={Link}
          href="/workforce/people"
          variant="light"
          startContent={<ChevronLeft className="h-4 w-4" />}
        >
          Back to Team Directory
        </Button>
      </div>

      <Card className="overflow-visible">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6 pb-4">
          <Avatar
            src={member.photo?.url}
            name={member.name}
            className="h-24 w-24"
            isBordered
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">{member.name}</h1>
            {displayTitle && (
              <p className="text-large text-default-500">{displayTitle}</p>
            )}
            {departmentNames.length > 0 && (
              <p className="text-small text-default-400">
                {departmentNames.join(", ")}
              </p>
            )}
            {member.quote && (
              <div className="mt-4 relative">
                <span className="absolute -left-2 -top-2 text-4xl text-default-300">
                  "
                </span>
                <p className="text-lg italic text-default-600 pl-4">
                  {member.quote}
                </p>
                <span className="absolute -right-2 -bottom-2 text-4xl text-default-300">
                  "
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="flex flex-col gap-6">
          {(email || phone) && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {email && (
                  <div>
                    <p className="text-small font-medium text-default-500">
                      Email
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className="text-default-600 hover:underline"
                    >
                      {email}
                    </a>
                  </div>
                )}
                {phone && (
                  <div>
                    <p className="text-small font-medium text-default-500">
                      Phone
                    </p>
                    <a
                      href={`tel:${phone}`}
                      className="text-default-600 hover:underline"
                    >
                      {phone}
                    </a>
                  </div>
                )}
              </div>
              <Divider />
            </>
          )}

          {member.bio && (
            <>
              <div>
                <p className="text-default-600">{member.bio}</p>
              </div>
            </>
          )}

          {member.subjectAssignments &&
            member.subjectAssignments.length > 0 && (
              <div>
                <h3 className="text-medium font-semibold text-default-700 mb-4">
                  Subjects & Grades Taught
                </h3>
                <SubjectAssignments assignments={member.subjectAssignments} />
              </div>
            )}
        </CardBody>
      </Card>
    </div>
  );
}
