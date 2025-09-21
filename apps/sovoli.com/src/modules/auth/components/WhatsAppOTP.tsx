"use client";

import { useState } from "react";
import { WhatsAppOTPSendForm } from "./WhatsAppOTPSendForm";
import { WhatsAppOTPVerifyForm } from "./WhatsAppOTPVerifyForm";
import { sendOTPAction } from "../actions/sendOTPAction";
import { verifyOTPAction } from "../actions/verifyOTPAction";

export interface WhatsAppOTPProps {
  onSuccess?: (phone: string) => void;
  onError?: (message: string) => void;
}

type Step = "send" | "verify";

export function WhatsAppOTP({ onSuccess, onError }: WhatsAppOTPProps) {
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
        <WhatsAppOTPSendForm
          sendAction={sendOTPAction}
          onSuccess={handleSendSuccess}
          onError={onError}
        />
      ) : (
        <WhatsAppOTPVerifyForm
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
