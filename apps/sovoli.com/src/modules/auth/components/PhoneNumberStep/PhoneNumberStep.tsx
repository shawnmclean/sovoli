"use client";

import { useState } from "react";
import { PhoneNumberForm } from "./PhoneNumberForm";
import { PhoneOTPVerifyForm } from "./PhoneOTPVerifyForm";
import { sendOTPAction } from "../../actions/sendOTPAction";
import { verifyOTPAction } from "../../actions/verifyOTPAction";
import type { SignupWizardMode } from "../types";
import type { LeadPhoneActionState } from "../../actions/states";

export interface PhoneNumberStepProps {
  mode: SignupWizardMode;
  onSuccess?: (phone: string) => void;
  onError?: (message: string) => void;
}

type Step = "send" | "verify";

export function PhoneNumberStep({
  onSuccess,
  onError,
  mode,
}: PhoneNumberStepProps) {
  const [currentStep, setCurrentStep] = useState<Step>("send");
  const [phone, setPhone] = useState("");
  const [otpToken, setOtpToken] = useState<string | undefined>();

  const _handleSendSuccess = (phoneNumber: string, token: string) => {
    setPhone(phoneNumber);
    setOtpToken(token);
    setCurrentStep("verify");
  };

  const handleVerifySuccess = (phoneNumber: string) => {
    onSuccess?.(phoneNumber);
  };

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
    return new Promise((resolve) => {
      console.log("leadPhoneAction", phone);
      resolve({
        status: "success",
        message: "Phone sent successfully",
        leadId: "123456",
      });
    });
  };

  const phoneAction = mode === "lead" ? leadPhoneAction : sendOTPAction;

  return (
    <div className="space-y-4">
      {currentStep === "send" ? (
        <PhoneNumberForm sendAction={phoneAction} defaultPhone={phone} />
      ) : (
        <PhoneOTPVerifyForm
          phone={phone}
          verifyAction={verifyOTPAction}
          sendAction={sendOTPAction}
          otpToken={otpToken}
          onSuccess={handleVerifySuccess}
          onError={onError}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
