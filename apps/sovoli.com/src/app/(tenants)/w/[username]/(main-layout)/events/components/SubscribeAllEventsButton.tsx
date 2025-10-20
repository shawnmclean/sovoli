"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@sovoli/ui/components/drawer";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import type { OrgInstance } from "~/modules/organisations/types";
import { BellIcon, CheckCircleIcon } from "lucide-react";
import { SignupDialog } from "~/modules/auth/components/SignupDialog";
import posthog from "posthog-js";

export interface SubscribeAllEventsButtonProps {
  orgInstance: OrgInstance;
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  size?: "sm" | "md" | "lg";
}

export function SubscribeAllEventsButton({
  orgInstance,
  variant = "solid",
  size = "md",
}: SubscribeAllEventsButtonProps) {
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
  const [phone, setPhone] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  const handleSignupSuccess = ({
    phone,
    firstName,
    lastName,
  }: {
    phone: string;
    firstName?: string;
    lastName?: string;
  }) => {
    posthog.capture("SubscribedToAllEvents", {
      tenant: orgInstance.org.username,
    });
    setPhone(phone);
    setFirstName(firstName ?? null);
    setLastName(lastName ?? null);

    onSignupOpenChange();
    setStep("child");
    onCustomFlowOpen();
  };

  const handleCustomFlowClose = () => {
    setStep("child");
    setPhone(null);
    setFirstName(null);
    setLastName(null);
    onCustomFlowClose();
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        startContent={<BellIcon size={16} />}
        onPress={onSignupOpen}
      >
        Subscribe to All Events
      </Button>

      {/* Signup Dialog */}
      <SignupDialog
        isOpen={isSignupOpen}
        onOpenChange={onSignupOpenChange}
        mode="lead"
        onSuccess={handleSignupSuccess}
        successMessage={`Thanks for your interest in ${orgInstance.org.name} events! We'll notify you about all upcoming events.`}
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
              <h2 className="text-lg font-semibold">Subscribe to All Events</h2>
              <p className="text-sm text-default-500">
                We'll send you updates about all upcoming events at{" "}
                {orgInstance.org.name} to your WhatsApp.
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
                    We'll notify you about all upcoming events at{" "}
                    {orgInstance.org.name} via WhatsApp.
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
