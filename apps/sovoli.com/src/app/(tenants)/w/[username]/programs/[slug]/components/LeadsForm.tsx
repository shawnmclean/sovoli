import { useState } from "react";
import { NamesForm } from "~/app/signin/components/NamesForm";
import { WhatsAppOTPForm } from "~/app/signin/components/WhatsAppOTPForm";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import { setPersonProperties } from "../lib/programAnalytics";

export interface LeadsFormProps {
  onSuccess?: (lead: {
    phone: string;
    firstName?: string;
    lastName?: string;
  }) => void;
  onError?: (message?: string) => void;
  cycle?: ProgramCycle;
  program?: Program;
}

export function LeadsForm({
  onSuccess,
  onError,
  cycle,
  program,
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
          setPersonProperties({
            phone: phoneNumber,
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

          setPersonProperties({
            first_name: firstName,
            last_name: lastName,
            name: `${firstName} ${lastName}`,
          });

          setStep("choice");
        }}
        onError={onError}
      />
    );
  }

  if (step === "choice") {
    return <div>Choice</div>;
  }

  return null;
}
