"use client";

import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import type { Service } from "~/modules/services/types";
import { SignupDialog } from "~/modules/auth/components/SignupDialog";
import type { OrgInstance } from "~/modules/organisations/types";
import { getWhatsAppContact } from "~/utils/whatsappUtils";

interface ServiceCTASectionProps {
  service: Service;
  orgInstance: OrgInstance;
}

export function ServiceCTASection({
  service,
  orgInstance,
}: ServiceCTASectionProps) {
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
    <section className="my-6 pb-6">
      <div className="space-y-4">
        {service.price && (
          <div>
            <p className="text-lg font-semibold text-foreground">
              {service.price}
            </p>
          </div>
        )}

        <Button
          color="primary"
          variant="flat"
          radius="full"
          onPress={onSignupOpen}
          fullWidth
          size="lg"
        >
          {actionText}
        </Button>
      </div>

      <SignupDialog
        isOpen={isSignupOpen}
        onOpenChange={onSignupOpenChange}
        mode="lead"
        whatsappNumber={whatsappNumber}
        successMessage={`Thanks for your interest in ${service.name}! We'll be in touch soon.`}
      />
    </section>
  );
}
