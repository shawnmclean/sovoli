"use client";

import { useState } from "react";
import { PhoneNumberForm } from "./PhoneNumberForm";
import { PhoneOTPVerifyForm } from "./PhoneOTPVerifyForm";
import { sendOTPAction } from "../../actions/sendOTPAction";
import { verifyOTPAction } from "../../actions/verifyOTPAction";
import type { SignupWizardMode } from "../types";

export interface PhoneNumberStepProps {
  mode: SignupWizardMode;
  onSuccess?: (phone: string) => void;
  onError?: (message: string) => void;
}

type Step = "send" | "verify";

export function PhoneNumberStep({ onSuccess, onError }: PhoneNumberStepProps) {
  const [currentStep, setCurrentStep] = useState<Step>("send");
  const [phone, setPhone] = useState("");
  const [otpToken, setOtpToken] = useState<string | undefined>();

  const handleSendSuccess = (phoneNumber: string, token: string) => {
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

  return (
    <div className="space-y-4">
      {currentStep === "send" ? (
        <PhoneNumberForm
          sendAction={sendOTPAction}
          onSuccess={handleSendSuccess}
          onError={onError}
        />
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
