"use client";

import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import type { Service } from "~/modules/services/types";
import { SignupDialog } from "~/modules/auth/components/SignupDialog";
import type { OrgInstance } from "~/modules/organisations/types";
import { getWhatsAppContact } from "~/utils/whatsappUtils";

export interface ServiceDetailMobileFooterProps {
  orgInstance: OrgInstance;
  service: Service;
}

export function ServiceDetailMobileFooter({
  orgInstance,
  service,
}: ServiceDetailMobileFooterProps) {
  const {
    isOpen: isSignupOpen,
    onOpen: onSignupOpen,
    onOpenChange: onSignupOpenChange,
  } = useDisclosure({
    defaultOpen: false,
  });

  const whatsappNumber = getWhatsAppContact(orgInstance);
  const actionText =
    service.actionText ?? `Request ${service.name.toLowerCase()}`;

  return (
    <>
      <footer className="fixed left-0 right-0 bg-background border-t border-default shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40 [bottom:max(0px,calc(100dvh-100vh))]">
        <div className="flex w-full items-center justify-between py-3 gap-4">
          {service.price && (
            <div className="flex-1 text-sm font-medium text-foreground">
              {service.price}
            </div>
          )}
          <div className="shrink-0">
            <Button
              variant="solid"
              color="primary"
              radius="full"
              size="lg"
              className="min-w-[140px]"
              onPress={onSignupOpen}
            >
              {actionText}
            </Button>
          </div>
        </div>
      </footer>

      <SignupDialog
        isOpen={isSignupOpen}
        onOpenChange={onSignupOpenChange}
        mode="lead"
        whatsappNumber={whatsappNumber}
        successMessage={`Thanks for your interest in ${service.name}! We'll be in touch soon.`}
      />
    </>
  );
}
