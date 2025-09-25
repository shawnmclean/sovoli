"use client";

import { useState } from "react";
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
import posthog from "posthog-js";

export interface PhoneNumberStepProps {
  mode: SignupWizardMode;
  onSuccess?: (phone: string) => void;
}

type Step = "send" | "verify";

export function PhoneNumberStep({ onSuccess, mode }: PhoneNumberStepProps) {
  const [currentStep, setCurrentStep] = useState<Step>("send");
  const [phone, setPhone] = useState("");
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

    posthog.capture("LeadPhoneEntered", {
      $set: {
        phone: phone,
      },
    });

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

  return (
    <div className="space-y-4">
      {currentStep === "send" ? (
        <PhoneNumberForm sendAction={phoneAction} defaultPhone={phone} />
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
