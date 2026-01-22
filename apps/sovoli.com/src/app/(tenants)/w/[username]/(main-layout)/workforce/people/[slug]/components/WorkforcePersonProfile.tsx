"use client";

import { Button } from "@sovoli/ui/components/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { MemberDetailsContent } from "~/modules/workforce/components/MemberDetailsContent";
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

      <MemberDetailsContent member={member} />
    </div>
  );
}
