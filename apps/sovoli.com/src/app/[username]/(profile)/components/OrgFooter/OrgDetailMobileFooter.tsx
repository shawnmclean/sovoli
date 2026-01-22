"use client";

import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import { MessageSquareShareIcon } from "lucide-react";
import { gradientBorderButton } from "~/components/GradientBorderButton";
import { SignupDialog } from "~/modules/auth/components/SignupDialog";
import type { OrgInstance } from "~/modules/organisations/types";
import { getWhatsAppContact } from "~/utils/whatsappUtils";

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
      <footer className="fixed left-0 right-0 border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40 [bottom:max(0px,calc(100dvh-100vh))]">
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

      {/* Organization Contact Dialog */}
      <SignupDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        mode="auth"
        whatsappNumber={whatsappNumber}
        successMessage={`Thanks for your interest in ${orgInstance.org.name}! We'll be in touch soon.`}
        onSuccess={() => {
          onOpenChange();
        }}
        onError={() => {
          onOpenChange();
        }}
      />
    </>
  );
}
