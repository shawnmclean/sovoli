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
import { BellIcon } from "lucide-react";
import { trackProgramAnalytics } from "../lib/programAnalytics";
import { NamesForm, WhatsAppOTPForm } from "~/modules/auth";

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
  const [step, setStep] = useState<"otp" | "names" | "child">("otp");
  const [phone, setPhone] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  const handleClose = () => {
    setStep("otp");
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
            {step === "otp" ? (
              <WhatsAppOTPForm
                onSuccess={(phoneNumber) => {
                  setPhone(phoneNumber);
                  trackProgramAnalytics(
                    "SubscribePhoneEntered",
                    program,
                    null,
                    {
                      $set: {
                        phone: phoneNumber,
                      },
                    },
                  );
                  setStep("names");
                }}
                onError={(message) => {
                  console.error("Phone validation error:", message);
                }}
              />
            ) : step === "names" ? (
              <NamesForm
                onSuccess={(firstName, lastName) => {
                  setFirstName(firstName);
                  setLastName(lastName);
                  trackProgramAnalytics("SubscribeNameEntered", program, null, {
                    $set: {
                      first_name: firstName,
                      last_name: lastName,
                      name: `${firstName} ${lastName}`,
                    },
                  });
                  setStep("child");
                }}
                onError={(message) => {
                  console.error("Name validation error:", message);
                }}
              />
            ) : (
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

                      handleClose();
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

                      handleClose();
                    }}
                  >
                    No, I'm just interested
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
