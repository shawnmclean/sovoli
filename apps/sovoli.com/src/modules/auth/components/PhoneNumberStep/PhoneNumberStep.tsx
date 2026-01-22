"use client";

import { useState } from "react";
import { sendOTPAction } from "../../actions/sendOTPAction";
import type {
  LeadPhoneActionState,
  SendOTPActionState,
} from "../../actions/states";
import type { VerifyState } from "../../actions/verifyOTPAction";
import { verifyOTPAction } from "../../actions/verifyOTPAction";
import type { SignupWizardMode } from "../types";
import { PhoneNumberForm } from "./PhoneNumberForm";
import { PhoneOTPVerifyForm } from "./PhoneOTPVerifyForm";

export interface PhoneNumberStepProps {
  mode: SignupWizardMode;
  onSuccess?: (phone: string, rawPhone?: string, countryIso?: string) => void;
  defaultPhone?: string;
  defaultCountryCode?: "US" | "GB" | "GY" | "JM";
}

type Step = "send" | "verify";

export function PhoneNumberStep({
  onSuccess,
  mode,
  defaultPhone,
  defaultCountryCode,
}: PhoneNumberStepProps) {
  const [currentStep, setCurrentStep] = useState<Step>("send");
  const [phone, setPhone] = useState<string>("");
  const [otpToken, setOtpToken] = useState<string | undefined>();

  const handleBack = () => {
    setCurrentStep("send");
    setPhone("");
    setOtpToken(undefined);
  };

  const leadPhoneAction = async (
    _prevState: LeadPhoneActionState,
    formData: FormData,
  ): Promise<LeadPhoneActionState> => {
    const phone = formData.get("phone") as string;
    const rawPhone = formData.get("rawPhone") as string | undefined;
    const countryIso = formData.get("countryIso") as string | undefined;

    onSuccess?.(phone, rawPhone, countryIso);
    return new Promise((resolve) => {
      resolve({
        status: "success",
        message: "Phone sent successfully",
        leadId: "123456",
      });
    });
  };

  const otpPhoneAction = async (
    prevState: SendOTPActionState,
    formData: FormData,
  ): Promise<SendOTPActionState> => {
    const result = await sendOTPAction(prevState, formData);

    if (result?.status === "success") {
      setOtpToken(result.otpToken);
      setPhone(result.phone ?? (formData.get("phone") as string)); // for whatever reason, the phone is not set in the result
      setCurrentStep("verify");
    }
    return result;
  };

  const verifyPhoneAction = async (
    prevState: VerifyState,
    formData: FormData,
  ): Promise<VerifyState> => {
    const result = await verifyOTPAction(prevState, formData);
    if (result?.status === "success") {
      onSuccess?.(phone);
    }
    return result;
  };

  const phoneAction = mode === "lead" ? leadPhoneAction : otpPhoneAction;

  return (
    <div className="space-y-4">
      {currentStep === "send" ? (
        <PhoneNumberForm
          sendAction={phoneAction}
          defaultPhone={defaultPhone}
          defaultCountryCode={defaultCountryCode}
        />
      ) : (
        <PhoneOTPVerifyForm
          phone={phone}
          verifyAction={verifyPhoneAction}
          sendAction={sendOTPAction}
          otpToken={otpToken}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
