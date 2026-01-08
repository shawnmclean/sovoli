"use client";

import { PhoneNumberStep } from "~/modules/auth/components/PhoneNumberStep/PhoneNumberStep";

export interface PhoneStepProps {
  defaultPhone?: string;
  defaultCountryCode?: "US" | "GB" | "GY" | "JM";
  onSuccess: (phone: string, rawPhone?: string, countryIso?: string) => void;
}

export function PhoneStep({
  defaultPhone,
  defaultCountryCode,
  onSuccess,
}: PhoneStepProps) {
  return (
    <PhoneNumberStep
      mode="lead"
      onSuccess={onSuccess}
      defaultPhone={defaultPhone}
      defaultCountryCode={defaultCountryCode}
    />
  );
}
