"use client";

import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
} from "@sovoli/ui/components/drawer";
import { Link } from "@sovoli/ui/components/link";

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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";

  const whatsappNumber = orgInstance.org.locations
    .find((l) => l.isPrimary)
    ?.contacts.find((c) => c.type === "whatsapp")?.value;

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40">
        <div className="flex w-full items-center justify-between py-3 gap-4">
          {/* Left side - Program info badge */}
          <div className="flex flex-1 items-center">
            <Button
              as={Link}
              variant="light"
              color="primary"
              className="underline"
              onPress={onOpen}
            >
              September 2025
            </Button>
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

      <Drawer
        isOpen={isOpen}
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
            <div className="space-y-4 p-4">
              {/* Term Selection */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">September 2025</span>
                  <span className="text-sm text-default-600">
                    Sept 8 - Dec 12
                  </span>
                  <span className="text-xs text-default-500">
                    Deadline: August 15
                  </span>
                </div>
                <Button variant="flat" color="default" className="font-medium">
                  Change
                </Button>
              </div>

              {/* WhatsApp Link */}
              <div className="pt-4">
                <Button
                  as={WhatsAppLink}
                  phoneNumber={whatsappNumber}
                  message={`Hi, I'm interested in the ${programName} program for September 2025 (Sept 8 - Dec 12). Can you provide more details about enrollment?`}
                  page="mobile-footer"
                  variant="shadow"
                  color="primary"
                  radius="lg"
                  size="lg"
                  className="font-semibold px-8 w-full"
                  onPress={onOpenChange}
                >
                  Reserve
                </Button>
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
