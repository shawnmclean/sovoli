"use client";

import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { BellIcon, CheckCircleIcon } from "lucide-react";
import posthog from "posthog-js";
import { useState } from "react";
import { SignupDialog } from "~/modules/auth/components/SignupDialog";
import type { Event } from "~/modules/events/types";
import type { OrgInstance } from "~/modules/organisations/types";

export interface SubscribeEventButtonProps {
  event: Event;
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  orgInstance: OrgInstance;
}

export function SubscribeEventButton({
  event,
  orgInstance,
  variant = "solid",
}: SubscribeEventButtonProps) {
  const {
    isOpen: isSignupOpen,
    onOpen: onSignupOpen,
    onOpenChange: onSignupOpenChange,
  } = useDisclosure({
    defaultOpen: false,
  });
  const {
    isOpen: isCustomFlowOpen,
    onOpen: onCustomFlowOpen,
    onClose: onCustomFlowClose,
  } = useDisclosure({
    defaultOpen: false,
  });
  const [step, setStep] = useState<"child" | "thank-you">("child");

  const handleSignupSuccess = ({
    phone,
    firstName,
    lastName,
  }: {
    phone: string;
    firstName?: string;
    lastName?: string;
  }) => {
    posthog.capture("SubscribedToEvent", {
      event: event.slug,
      tenant: orgInstance.org.username,
      $set: {
        phone: phone,
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`,
      },
    });

    onSignupOpenChange();
    setStep("child");
    onCustomFlowOpen();
  };

  const handleCustomFlowClose = () => {
    setStep("child");
    onCustomFlowClose();
  };

  return (
    <>
      <Button variant={variant} isIconOnly radius="full" onPress={onSignupOpen}>
        <BellIcon size={18} />
      </Button>

      {/* Signup Dialog */}
      <SignupDialog
        isOpen={isSignupOpen}
        onOpenChange={onSignupOpenChange}
        mode="lead"
        onSuccess={handleSignupSuccess}
        successMessage={`Thanks for your interest in ${event.name}! We'll be in touch soon.`}
      />

      {/* Custom Flow Drawer */}
      <Drawer
        isOpen={isCustomFlowOpen}
        onClose={handleCustomFlowClose}
        placement="bottom"
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-row items-center justify-between gap-3 px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg font-semibold">Subscribe for Updates</h2>
              <p className="text-sm text-default-500">
                We'll send you updates about {event.name} to your WhatsApp.
              </p>
            </div>
          </DrawerHeader>
          <DrawerBody className="px-4 pb-4">
            {step === "child" ? (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-success mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    You're subscribed!
                  </h3>
                  <p className="text-sm text-default-600">
                    We'll notify you about updates for {event.name} via
                    WhatsApp.
                  </p>
                </div>
                <Button
                  className="w-full"
                  variant="solid"
                  onPress={handleCustomFlowClose}
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-success mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Thank you!</h3>
                  <p className="text-sm text-default-600">
                    Your subscription has been confirmed.
                  </p>
                </div>
                <Button
                  className="w-full"
                  variant="solid"
                  onPress={handleCustomFlowClose}
                >
                  Done
                </Button>
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
