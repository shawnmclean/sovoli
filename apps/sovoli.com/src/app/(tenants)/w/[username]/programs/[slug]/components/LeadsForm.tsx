import { useState } from "react";
import { NamesForm } from "~/app/signin/components/NamesForm";
import { WhatsAppOTPForm } from "~/app/signin/components/WhatsAppOTPForm";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import { trackProgramAnalytics } from "../lib/programAnalytics";
import { Button } from "@sovoli/ui/components/button";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { ProgramPriceCard } from "../../../(main-layout)/programs/components/ProgramPriceCard";

export interface LeadsFormProps {
  whatsappNumber?: string;
  onSuccess?: (lead: {
    phone: string;
    firstName?: string;
    lastName?: string;
  }) => void;
  onError?: (message?: string) => void;
  cycle?: ProgramCycle;
  program: Program;
}

export function LeadsForm({
  onSuccess,
  onError,
  cycle,
  program,
  whatsappNumber,
}: LeadsFormProps) {
  const [step, setStep] = useState<"otp" | "names" | "choice">("otp");
  const [phone, setPhone] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  if (step === "otp") {
    return (
      <WhatsAppOTPForm
        onSuccess={(phoneNumber) => {
          setPhone(phoneNumber);

          trackProgramAnalytics("LeadPhoneEntered", program, cycle, {
            $set: {
              phone: phoneNumber,
            },
          });

          setStep("names");
        }}
        onError={onError}
      />
    );
  }

  if (step === "names" && phone) {
    return (
      <NamesForm
        onSuccess={(firstName, lastName) => {
          setFirstName(firstName);
          setLastName(lastName);

          trackProgramAnalytics("LeadNameEntered", program, cycle, {
            $set: {
              first_name: firstName,
              last_name: lastName,
              name: `${firstName} ${lastName}`,
            },
          });

          setStep("choice");
        }}
        onError={onError}
      />
    );
  }

  if (step === "choice" && phone && firstName && lastName) {
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

        <Button
          color="primary"
          as={WhatsAppLink}
          phoneNumber={whatsappNumber}
          message={`Hi! My name is ${firstName} ${lastName} and I'm interested in ${program.name}.`}
          fullWidth
          onPress={() => {
            trackProgramAnalytics("Lead", program, cycle, {
              $set: {
                role: program.audience === "student" ? "student" : "parent",
              },
            });

            onSuccess?.({ phone, firstName, lastName });
          }}
        >
          Continue to WhatsApp
        </Button>
      </div>
    );
  }

  return null;
}
