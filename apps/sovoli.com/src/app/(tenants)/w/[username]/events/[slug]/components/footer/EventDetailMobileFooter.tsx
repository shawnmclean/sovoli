"use client";

import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
// import { Link } from "@sovoli/ui/components/link";

import { gradientBorderButton } from "~/components/GradientBorderButton";

import type { OrgInstance } from "~/modules/organisations/types";
import type { Event } from "~/modules/events/types";
import { MessageSquareShareIcon } from "lucide-react";
import { getWhatsAppContact } from "~/utils/whatsappUtils";
import { SignupDialog } from "~/modules/auth/components/SignupDialog";

export interface EventDetailMobileFooterProps {
  orgInstance: OrgInstance;
  event: Event;
}

export function EventDetailMobileFooter({
  orgInstance,
  event,
}: EventDetailMobileFooterProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const whatsappNumber = getWhatsAppContact(orgInstance);

  return (
    <>
      <footer className="fixed left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40 [bottom:max(0px,calc(100dvh-100vh))]">
        <div className="flex w-full items-center py-3 justify-between">
          {/* Left side - Event info badge */}
          <div className="text-sm font-medium text-gray-700">{event.name}</div>

          {/* Right side - Reserve button */}
          <Button
            variant="shadow"
            radius="lg"
            startContent={<MessageSquareShareIcon size={16} />}
            className={gradientBorderButton()}
            onPress={onOpen}
          >
            Chat Now
          </Button>
        </div>
      </footer>

      {/* Signup Dialog */}
      <SignupDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        mode="lead"
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
