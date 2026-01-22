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
import { useState } from "react";
import type { Program } from "~/modules/academics/types";
import { SignupDialog } from "~/modules/auth/components/SignupDialog";
import { trackProgramAnalytics } from "../lib/programAnalytics";

export interface SubscribeProgramButtonProps {
  program: Program;
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
}

export function SubscribeProgramButton({
  program,
  variant = "solid",
}: SubscribeProgramButtonProps) {
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
    setPhone(phone);
    setFirstName(firstName ?? null);
    setLastName(lastName ?? null);

    trackProgramAnalytics("SubscribePhoneEntered", program, null, {
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
    setPhone(null);
    setFirstName(null);
    setLastName(null);
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
        successMessage={`Thanks for your interest in ${program.name ?? program.standardProgramVersion?.program.name}! We'll be in touch soon.`}
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
                We'll send you updates about{" "}
                {program.name ?? program.standardProgramVersion?.program.name}{" "}
                to your WhatsApp.
              </p>
            </div>
          </DrawerHeader>
          <DrawerBody className="px-4 pb-4">
            {step === "child" ? (
              <div className="space-y-6">
                <div className="text-left">
                  <h1 className="text-3xl font-bold mb-2">
                    Do you have a child in this program?
                  </h1>
                  <p className="text-base">
                    This helps us provide more relevant updates.
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <Button
                    color="primary"
                    fullWidth
                    onPress={() => {
                      trackProgramAnalytics("Subscribe", program, null, {
                        phone: phone ?? "",
                        first_name: firstName,
                        last_name: lastName,
                        name: `${firstName} ${lastName}`,
                        has_child: true,
                      });

                      setStep("thank-you");
                    }}
                  >
                    Yes, I have a child in this program
                  </Button>
                  <Button
                    color="default"
                    variant="flat"
                    fullWidth
                    onPress={() => {
                      trackProgramAnalytics("Subscribe", program, null, {
                        phone: phone ?? "",
                        first_name: firstName,
                        last_name: lastName,
                        name: `${firstName} ${lastName}`,
                        has_child: false,
                      });

                      setStep("thank-you");
                    }}
                  >
                    No, I'm just interested
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircleIcon className="w-16 h-16 text-green-500" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">
                    Thank you for subscribing!
                  </h1>
                  <p className="text-base text-default-600">
                    We'll be in touch with updates about{" "}
                    {program.name ??
                      program.standardProgramVersion?.program.name}{" "}
                    via WhatsApp.
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <Button
                    color="primary"
                    fullWidth
                    onPress={handleCustomFlowClose}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
