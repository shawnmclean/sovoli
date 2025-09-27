"use client";

import {
  Drawer,
  DrawerBody,
  DrawerContent,
} from "@sovoli/ui/components/drawer";
import { SignupWizard } from "./SignupWizard";
import type { SignupWizardMode } from "./types";
import type { Program, ProgramCycle } from "~/modules/academics/types";

export interface SignupDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  whatsappNumber?: string;
  onSuccess?: (lead: {
    phone: string;
    firstName?: string;
    lastName?: string;
  }) => void;
  onError?: (message?: string) => void;
  cycle?: ProgramCycle;
  program?: Program;
  successMessage?: string;
  mode: SignupWizardMode;
}

export function SignupDialog({
  isOpen,
  onOpenChange,
  whatsappNumber,
  onSuccess,
  onError,
  cycle,
  program,
  successMessage,
  mode,
}: SignupDialogProps) {
  return (
    <Drawer
      isOpen={isOpen}
      size="5xl"
      placement="bottom"
      backdrop="opaque"
      onOpenChange={onOpenChange}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
            },
          },
          exit: {
            y: 100,
            opacity: 0,
            transition: {
              duration: 0.3,
            },
          },
        },
      }}
    >
      <DrawerContent>
        <DrawerBody className="mt-4">
          <div className="space-y-4 py-4">
            <SignupWizard
              mode={mode}
              cycle={cycle}
              program={program}
              whatsappNumber={whatsappNumber}
              onSuccess={onSuccess}
              onError={onError}
              successMessage={successMessage}
            />
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
