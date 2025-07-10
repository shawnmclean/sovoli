"use client";

import { Button } from "@sovoli/ui/components/button";
import { Badge } from "@sovoli/ui/components/badge";
import { SendIcon, ClockIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";

import type { OrgProgram } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";

export interface ProgramDetailMobileFooterProps {
  orgInstance: OrgInstance;
  program: OrgProgram;
}

export function ProgramDetailMobileFooter({
  orgInstance,
  program,
}: ProgramDetailMobileFooterProps) {
  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";

  const whatsappNumber = orgInstance.org.locations
    .find((l) => l.isPrimary)
    ?.contacts.find((c) => c.type === "whatsapp")?.value;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40">
      <div className="flex w-full items-center justify-between py-3 gap-4">
        {/* Left side - Program info badge */}
        <div className="flex flex-1 items-center">
          <Badge
            variant="flat"
            color="primary"
            className="flex items-center gap-1.5 px-3 py-2"
          >
            <span className="text-sm font-medium">Limited Spots</span>
          </Badge>
        </div>

        {/* Right side - Reserve button */}
        <div className="flex-shrink-0">
          <Button
            as={WhatsAppLink}
            phoneNumber={whatsappNumber}
            message={`Hi, I'm interested in the ${programName} program. Can you provide more details?`}
            page="mobile-footer"
            variant="shadow"
            color="primary"
            radius="lg"
            size="md"
            className="font-semibold px-6"
          >
            Reserve Now
          </Button>
        </div>
      </div>
    </footer>
  );
}
