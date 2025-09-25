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
import type { Program } from "~/modules/academics/types";
import { BellIcon, CheckCircleIcon } from "lucide-react";
import { trackProgramAnalytics } from "../lib/programAnalytics";
import { SignupWizard } from "~/modules/auth";

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
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultOpen: false,
  });
  const [step, setStep] = useState<"signup" | "child" | "thank-you">("signup");
  const [phone, setPhone] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  const handleClose = () => {
    setStep("signup");
    setPhone(null);
    setFirstName(null);
    setLastName(null);
    onClose();
  };

  const handleThankYouClose = () => {
    setStep("signup");
    setPhone(null);
    setFirstName(null);
    setLastName(null);
    onClose();
  };

  return (
    <>
      <Button variant={variant} isIconOnly radius="full" onPress={onOpen}>
        <BellIcon size={18} />
      </Button>

      <Drawer isOpen={isOpen} onClose={handleClose} placement="bottom">
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
            {step === "signup" ? (
              <SignupWizard
                mode="lead"
                onSuccess={({ phone, firstName, lastName }) => {
                  trackProgramAnalytics(
                    "SubscribePhoneEntered",
                    program,
                    null,
                    {
                      $set: {
                        phone: phone,
                        first_name: firstName,
                        last_name: lastName,
                        name: `${firstName} ${lastName}`,
                      },
                    },
                  );
                  setStep("child");
                }}
              />
            ) : step === "child" ? (
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
                    onPress={handleThankYouClose}
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
