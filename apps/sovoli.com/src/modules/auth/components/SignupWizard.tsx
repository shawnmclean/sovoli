"use client";

import { useState } from "react";
import { NamesForm } from "./NamesForm";
import type { SignupWizardMode } from "./types";
import { PhoneNumberStep } from "./PhoneNumberStep/PhoneNumberStep";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import { trackProgramAnalytics } from "~/app/(tenants)/w/[username]/programs/[slug]/lib/programAnalytics";
import { Button } from "@sovoli/ui/components/button";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { ProgramPriceCard } from "~/app/(tenants)/w/[username]/(main-layout)/programs/components/ProgramPriceCard";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import posthog from "posthog-js";
import { formatCycleLabel } from "~/utils/dateUtils";

export interface SignupWizardProps {
  whatsappNumber?: string;
  onSuccess?: (lead: {
    phone: string;
    firstName?: string;
    lastName?: string;
  }) => void;
  onError?: (message?: string) => void;
  cycle?: ProgramCycle;
  program?: Program;
  // General signup success message
  successMessage?: string;
  mode: SignupWizardMode;
}

// Helper function to get formatted cycle label from a ProgramCycle
function getCycleLabel(cycle: ProgramCycle | undefined): string | null {
  if (!cycle) return null;

  const startDate =
    cycle.academicCycle.startDate ??
    cycle.academicCycle.globalCycle?.startDate;
  const endDate =
    cycle.academicCycle.endDate ??
    cycle.academicCycle.globalCycle?.endDate;

  if (!startDate || !endDate) return null;

  return formatCycleLabel(startDate, endDate);
}

export function SignupWizard({
  onSuccess,
  onError,
  cycle,
  program,
  whatsappNumber,
  successMessage,
  mode = "lead",
}: SignupWizardProps) {
  const [step, setStep] = useState<"phone" | "names" | "choice" | "success">(
    "phone",
  );
  const [phone, setPhone] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  if (step === "phone") {
    return (
      <PhoneNumberStep
        onSuccess={(phoneNumber) => {
          setPhone(phoneNumber);
          posthog.capture("LeadPhoneEntered", {
            $set: {
              phone: phoneNumber,
            },
          });
          setStep("names");
        }}
        mode={mode}
      />
    );
  }

  if (step === "names" && phone) {
    return (
      <NamesForm
        onSuccess={(firstName, lastName) => {
          setFirstName(firstName);
          setLastName(lastName);
          posthog.capture("LeadNameEntered", {
            $set: {
              first_name: firstName,
              last_name: lastName,
              name: `${firstName} ${lastName}`,
            },
          });

          // Track analytics if program is provided
          if (program) {
            trackProgramAnalytics("LeadNameEntered", program, cycle, {
              $set: {
                first_name: firstName,
                last_name: lastName,
                name: `${firstName} ${lastName}`,
              },
            });
          }

          if (!program) {
            onSuccess?.({ phone, firstName, lastName });
          } else {
            setStep("choice");
          }
        }}
        onError={onError}
      />
    );
  }

  if (step === "choice" && phone && firstName && lastName && program) {
    const cycleLabel = getCycleLabel(cycle);
    const programName =
      program.name ?? program.standardProgramVersion?.program.name;
    const cycleSuffix = cycleLabel ? ` for ${cycleLabel}` : "";

    return (
      <div>
        {/* Program Information Section */}
        {cycle && (
          <div className="mb-6 p-4 bg-content2 rounded-lg border border-foreground-200">
            <div className="flex flex-col gap-3">
              {/* Pricing Information */}
              <div className="flex flex-col gap-3">
                {cycle.pricingPackage.pricingItems
                  .filter(
                    (item) =>
                      item.purpose === "tuition" ||
                      item.purpose === "registration",
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-content1 rounded-lg border border-foreground-200"
                    >
                      <span className="text-sm font-medium text-foreground-700 capitalize">
                        {item.purpose}
                      </span>
                      <ProgramPriceCard
                        pricingPackage={cycle.pricingPackage}
                        pricingItemId={item.id}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2 w-full">
          <Button
            color="primary"
            as={WhatsAppLink}
            phoneNumber={whatsappNumber}
            message={`Hi! My name is ${firstName} ${lastName} and I'm interested in enrolling in ${programName}${cycleSuffix}.`}
            fullWidth
            onPress={() => {
              trackProgramAnalytics("Lead", program, cycle, {
                selection: "enroll",
              });

              onSuccess?.({ phone, firstName, lastName });
            }}
          >
            Enroll Now
          </Button>
          <Button
            color="primary"
            variant="flat"
            as={WhatsAppLink}
            phoneNumber={whatsappNumber}
            message={`Hi! My name is ${firstName} ${lastName} and I'm interested in ${programName}${cycleSuffix}. I would like to schedule a visit.`}
            fullWidth
            onPress={() => {
              trackProgramAnalytics("Lead", program, cycle, {
                selection: "visit",
              });

              onSuccess?.({ phone, firstName, lastName });
            }}
          >
            Schedule a Visit
          </Button>
          <Button
            color="default"
            as={WhatsAppLink}
            phoneNumber={whatsappNumber}
            message={`Hi! My name is ${firstName} ${lastName} and I'm interested in ${programName}${cycleSuffix}. I would like more information.`}
            fullWidth
            onPress={() => {
              trackProgramAnalytics("Lead", program, cycle, {
                selection: "more_information",
              });

              onSuccess?.({ phone, firstName, lastName });
            }}
            startContent={<SiWhatsapp size={16} />}
          >
            Message Us
          </Button>
        </div>
      </div>
    );
  }

  if (step === "success" && phone && firstName && lastName && !program) {
    return (
      <div className="text-center space-y-4">
        <div className="text-6xl">🎉</div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome, {firstName}!</h1>
          <p className="text-base text-foreground-600">
            {successMessage ??
              "Your signup was successful. We'll be in touch soon!"}
          </p>
        </div>
        <Button
          color="primary"
          fullWidth
          onPress={() => {
            onSuccess?.({ phone, firstName, lastName });
          }}
        >
          Continue
        </Button>
      </div>
    );
  }

  return null;
}
