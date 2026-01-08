"use client";

import { NamesForm } from "~/modules/auth/components/NamesForm";

export interface NameStepProps {
  defaultFirstName?: string;
  defaultLastName?: string;
  onSuccess: (firstName: string, lastName: string) => void;
  onError?: (message: string) => void;
}

export function NameStep({
  defaultFirstName,
  defaultLastName,
  onSuccess,
  onError,
}: NameStepProps) {
  return (
    <NamesForm
      onSuccess={onSuccess}
      onError={onError}
      resetOnSuccess={false}
      defaultFirstName={defaultFirstName}
      defaultLastName={defaultLastName}
    />
  );
}
