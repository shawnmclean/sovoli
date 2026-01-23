"use client";

import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import type { Service } from "~/modules/services/types";
import { SignupDialog } from "~/modules/auth/components/SignupDialog";
import type { OrgInstance } from "~/modules/organisations/types";
import { getWhatsAppContact } from "~/utils/whatsappUtils";

export interface ServiceCardProps {
  service: Service;
  orgInstance: OrgInstance;
}

export function ServiceCard({ service, orgInstance }: ServiceCardProps) {
  const {
    isOpen: isSignupOpen,
    onOpen: onSignupOpen,
    onOpenChange: onSignupOpenChange,
  } = useDisclosure({
    defaultOpen: false,
  });

  const whatsappNumber = getWhatsAppContact(orgInstance);

  return (
    <>
      <Card className="bg-content1">
        <CardHeader className="flex flex-col items-start gap-1">
          <div className="text-base font-semibold text-foreground">
            {service.name}
          </div>
          <div className="text-sm text-foreground-500">
            {service.description}
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <Button
            color="primary"
            variant="flat"
            radius="full"
            onPress={onSignupOpen}
            fullWidth
          >
            Book / Learn more
          </Button>
        </CardBody>
      </Card>

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
