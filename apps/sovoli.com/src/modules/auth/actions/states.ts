import type { FieldErrors } from "@rvf/core";

export interface BasePhoneActionState {
  status: "error" | "success";
  message: string;
  errors?: FieldErrors;
}

export type SendOTPActionState =
  | ({
      otpToken?: string;
      phone?: string;
    } & BasePhoneActionState)
  | null;

export type LeadPhoneActionState =
  | ({
      leadId?: string;
    } & BasePhoneActionState)
  | null;

export type PhoneActionStates =
  | SendOTPActionState
  | LeadPhoneActionState
