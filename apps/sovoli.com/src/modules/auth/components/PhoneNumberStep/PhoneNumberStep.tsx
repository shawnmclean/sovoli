"use client";

import { useState, useEffect } from "react";
import { PhoneNumberForm } from "./PhoneNumberForm";
import { PhoneOTPVerifyForm } from "./PhoneOTPVerifyForm";
import { sendOTPAction } from "../../actions/sendOTPAction";
import type { VerifyState } from "../../actions/verifyOTPAction";
import { verifyOTPAction } from "../../actions/verifyOTPAction";
import type { SignupWizardMode } from "../types";
import type {
  LeadPhoneActionState,
  SendOTPActionState,
} from "../../actions/states";

export interface PhoneNumberStepProps {
  mode: SignupWizardMode;
  onSuccess?: (phone: string) => void;
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
  const [phone, setPhone] = useState(defaultPhone ?? "");
  const [otpToken, setOtpToken] = useState<string | undefined>();

  const handleBack = () => {
    setCurrentStep("send");
    setPhone("");
    setOtpToken(undefined);
  };

  const leadPhoneAction = async (
    prevState: LeadPhoneActionState,
    formData: FormData,
  ): Promise<LeadPhoneActionState> => {
    const phone = formData.get("phone") as string;

    onSuccess?.(phone);
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

  // Update phone state when defaultPhone changes
  useEffect(() => {
    if (defaultPhone !== undefined && currentStep === "send") {
      setPhone(defaultPhone);
    }
  }, [defaultPhone, currentStep]);

  return (
    <div className="space-y-4">
      {currentStep === "send" ? (
        <PhoneNumberForm
          sendAction={phoneAction}
          defaultPhone={phone}
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
