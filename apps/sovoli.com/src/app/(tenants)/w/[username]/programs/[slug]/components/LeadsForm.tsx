import { SignupWizard } from "~/modules/auth";
import type { Program, ProgramCycle } from "~/modules/academics/types";

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
  return (
    <SignupWizard
      mode="program"
      program={program}
      cycle={cycle}
      whatsappNumber={whatsappNumber}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
}
