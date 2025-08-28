import { useState } from "react";
import { NamesForm } from "~/app/signin/components/NamesForm";
import { WhatsAppOTPForm } from "~/app/signin/components/WhatsAppOTPForm";

export interface LeadsFormProps {
  onSuccess?: (lead: {
    phone: string;
    firstName?: string;
    lastName?: string;
  }) => void;
  onError?: (message?: string) => void;
}

export function LeadsForm({ onSuccess, onError }: LeadsFormProps) {
  const [step, setStep] = useState<"otp" | "names">("otp");
  const [phone, setPhone] = useState<string | null>(null);
  if (step === "otp") {
    return (
      <WhatsAppOTPForm
        onSuccess={(phoneNumber) => {
          setPhone(phoneNumber);

          setStep("names");
        }}
        onError={(message) => {
          setTimeout(() => {
            onError?.(message);
          }, 200);
        }}
      />
    );
  }

  if (step === "names" && phone) {
    return (
      <NamesForm
        onSuccess={(firstName, lastName) => {
          setTimeout(() => {
            onSuccess?.({ phone, firstName, lastName });
          }, 200);
        }}
        onError={(message) => {
          setTimeout(() => {
            onError?.(message);
          }, 200);
        }}
      />
    );
  }

  return null;
}
