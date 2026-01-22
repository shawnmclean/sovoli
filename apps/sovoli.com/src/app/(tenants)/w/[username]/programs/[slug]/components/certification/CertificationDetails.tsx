"use client";

import {
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { AwardIcon } from "lucide-react";
import { useEffect } from "react";
import { ShareButton } from "~/app/[username]/(profile)/components/OrgNavbar/ShareButton";
import type { Program } from "~/modules/academics/types";
import { trackProgramAnalytics } from "../../lib/programAnalytics";
import { SubscribeProgramButton } from "../SubscribeProgramButton";

interface CertificationDetailsProps {
  program: Program;
}

export function CertificationDetails({ program }: CertificationDetailsProps) {
  const certification = program.certification;

  // Track analytics when component mounts
  useEffect(() => {
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "certification",
    });
  }, [program]);

  if (!certification) {
    return null;
  }

  return (
    <DrawerContent>
      {(onClose) => (
        <>
          <DrawerHeader
            showBackButton
            onBackPress={onClose}
            endContent={
              <>
                <ShareButton
                  title="Share"
                  variant="light"
                  text={`Check out ${program.name} certification.`}
                />
                <SubscribeProgramButton program={program} variant="light" />
              </>
            }
          />
          <DrawerBody>
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <AwardIcon className="h-6 w-6 text-primary" />
                Certification
              </h1>

              <div className="p-3 sm:p-4 bg-default-50 rounded-lg border border-default-200">
                <p className="text-foreground-700 whitespace-pre-wrap">
                  {certification.description}
                </p>
              </div>
            </div>
          </DrawerBody>
        </>
      )}
    </DrawerContent>
  );
}
