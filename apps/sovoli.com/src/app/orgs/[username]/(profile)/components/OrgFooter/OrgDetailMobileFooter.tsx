"use client";

import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
} from "@sovoli/ui/components/drawer";
import { gradientBorderButton } from "~/components/GradientBorderButton";
import type { OrgInstance } from "~/modules/organisations/types";
import { MessageSquareShareIcon } from "lucide-react";
import { getWhatsAppContact } from "~/utils/whatsappUtils";
import { Divider } from "@sovoli/ui/components/divider";
import { SignupWizard } from "~/modules/auth";

export interface OrgDetailMobileFooterProps {
  orgInstance: OrgInstance;
}

export function OrgDetailMobileFooter({
  orgInstance,
}: OrgDetailMobileFooterProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const whatsappNumber = getWhatsAppContact(orgInstance);

  return (
    <>
      <footer className="fixed left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40 [bottom:max(0px,calc(100dvh-100vh))]">
        <div className="flex w-full items-center justify-between py-3 gap-4">
          {/* Left side - Organization info */}
          <div className="flex flex-1 items-center">
            <span className="text-sm font-medium text-foreground-700">
              {orgInstance.org.name}
            </span>
          </div>

          {/* Right side - Chat button */}
          <div className="shrink-0">
            <Button
              variant="shadow"
              color="primary"
              radius="lg"
              size="md"
              startContent={<MessageSquareShareIcon size={16} />}
              className={gradientBorderButton()}
              onPress={onOpen}
            >
              Chat Now
            </Button>
          </div>
        </div>
      </footer>

      {/* Organization Contact Drawer */}
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
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">
                    Get in touch with {orgInstance.org.name}
                  </span>
                  <span className="text-sm text-default-600">
                    We'd love to hear from you
                  </span>
                </div>
              </div>
              <Divider />
              <SignupWizard
                mode="general"
                whatsappNumber={whatsappNumber}
                successMessage={`Thanks for your interest in ${orgInstance.org.name}! We'll be in touch soon.`}
                onSuccess={() => {
                  onOpenChange();
                }}
                onError={() => {
                  onOpenChange();
                }}
              />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
