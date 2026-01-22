"use client";

import { Button } from "@sovoli/ui/components/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { XIcon } from "lucide-react";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import { SignupWizard } from "./SignupWizard";
import type { SignupWizardMode } from "./types";

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
      hideCloseButton
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
        {(onClose) => (
          <>
            <DrawerHeader
              classNames={{
                base: "py-0",
              }}
              endContent={
                <Button isIconOnly onPress={onClose} variant="light">
                  <XIcon size={24} />
                </Button>
              }
            />

            <DrawerBody>
              <div className="space-y-4 pb-4">
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
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
