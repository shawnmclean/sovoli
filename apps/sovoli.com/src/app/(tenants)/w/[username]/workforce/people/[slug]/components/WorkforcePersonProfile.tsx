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

export function WorkforcePersonProfile({
  member,
}: WorkforcePersonProfileProps) {
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
            <p className="text-large text-default-500">
              {member.positions.map((position) => position.name).join(", ")}
            </p>
            {member.departments.length > 0 && (
              <p className="text-small text-default-400">
                {member.departments.map((dept) => dept.name).join(", ")}
              </p>
            )}
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-4">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {member.email && (
                <div>
                  <p className="text-small font-medium text-default-500">
                    Email
                  </p>
                  <p className="text-default-600">{member.email}</p>
                </div>
              )}
              {member.phone && (
                <div>
                  <p className="text-small font-medium text-default-500">
                    Phone
                  </p>
                  <p className="text-default-600">{member.phone}</p>
                </div>
              )}
            </div>
          </div>

          <Divider />
          {member.bio && (
            <div>
              <p className="text-default-600">{member.bio}</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
