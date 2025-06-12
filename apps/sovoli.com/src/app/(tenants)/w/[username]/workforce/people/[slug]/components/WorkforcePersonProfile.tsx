import React from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { WorkforceMember } from "~/modules/workforce/types";

interface WorkforcePersonProfileProps {
  member: WorkforceMember;
}

function getPublicContact(member: WorkforceMember, type: "email" | "phone") {
  return (
    member.contacts?.find((c) => c.type === type && c.isPublic)?.value ?? ""
  );
}

export function WorkforcePersonProfile({
  member,
}: WorkforcePersonProfileProps) {
  const roles = member.roleAssignments;

  const positionNames = Array.from(new Set(roles.map((r) => r.position.name)));

  const departmentNames = Array.from(
    new Set(roles.map((r) => r.department?.name).filter(Boolean)),
  );

  const email = getPublicContact(member, "email");
  const phone = getPublicContact(member, "phone");

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
        <CardHeader className="flex flex-row items-center gap-6 pb-4">
          <Avatar
            src={member.image}
            name={member.name}
            className="h-24 w-24"
            isBordered
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{member.name}</h1>
            {positionNames.length > 0 && (
              <p className="text-large text-default-500">
                {positionNames.join(", ")}
              </p>
            )}
            {departmentNames.length > 0 && (
              <p className="text-small text-default-400">
                {departmentNames.join(", ")}
              </p>
            )}
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="flex flex-col gap-4">
          <div className="space-y-4">
            {(email || phone) && (
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
            )}
          </div>

          {member.bio && (
            <>
              <Divider />
              <div>
                <p className="text-default-600">{member.bio}</p>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
