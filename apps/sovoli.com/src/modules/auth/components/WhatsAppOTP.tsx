"use client";

import { useState } from "react";
import { WhatsAppOTPSendForm } from "./WhatsAppOTPSendForm";
import { WhatsAppOTPVerifyForm } from "./WhatsAppOTPVerifyForm";
import type { State } from "../actions/sendOTPAction";
import { sendOTPAction } from "../actions/sendOTPAction";
import { verifyOTPAction } from "../actions/verifyOTPAction";
import type { VerifyState } from "../actions/verifyOTPAction";

export interface WhatsAppOTPProps {
  onSuccess?: (phone: string) => void;
  onError?: (message: string) => void;
}

type Step = "send" | "verify";

export function WhatsAppOTP({ onSuccess, onError }: WhatsAppOTPProps) {
  const [currentStep, setCurrentStep] = useState<Step>("send");
  const [phone, setPhone] = useState("");
  const [otpToken, setOtpToken] = useState<string | undefined>();
  const [sendState, setSendState] = useState<State>(null);
  const [verifyState, setVerifyState] = useState<VerifyState>(null);
  const [sendPending, setSendPending] = useState(false);
  const [verifyPending, setVerifyPending] = useState(false);

  const handleSendFormAction = async (formData: FormData): Promise<State> => {
    setSendPending(true);
    setSendState(null);
    try {
      const result = await sendOTPAction(null, formData);
      setSendState(result);

      if (result?.status === "success" && result.otpToken) {
        setOtpToken(result.otpToken);
        const phoneNumber = formData.get("phone") as string;
        setPhone(phoneNumber);
        setCurrentStep("verify");
      }

      return result;
    } finally {
      setSendPending(false);
    }
  };

  const handleVerifyFormAction = async (
    formData: FormData,
  ): Promise<VerifyState> => {
    setVerifyPending(true);
    setVerifyState(null);
    try {
      const result = await verifyOTPAction(null, formData);
      setVerifyState(result);

      if (result?.status === "success") {
        onSuccess?.(phone);
      }

      return result;
    } finally {
      setVerifyPending(false);
    }
  };

  const handleSendSuccess = (_phoneNumber: string) => {
    // This is called from the send form component, but we already handled the state transition above
    // Just in case the component calls this
  };

  const handleVerifySuccess = (phoneNumber: string) => {
    onSuccess?.(phoneNumber);
  };

  const handleBack = () => {
    setCurrentStep("send");
    setPhone("");
    setOtpToken(undefined);
    setSendState(null);
    setVerifyState(null);
  };

  // Handle errors from both forms
  if (sendState?.status === "error") {
    onError?.(sendState.message);
  }

  if (verifyState?.status === "error") {
    onError?.(verifyState.message);
  }

  return (
    <div className="space-y-4">
      {/* Action state messages for send step */}
      {currentStep === "send" && sendState && (
        <div
          className={`p-3 rounded-lg ${
            sendState.status === "success"
              ? "bg-success-50 text-success-700 border border-success-200"
              : "bg-danger-50 text-danger-700 border border-danger-200"
          }`}
        >
          {sendState.message}
        </div>
      )}

      {currentStep === "send" ? (
        <WhatsAppOTPSendForm
          formAction={handleSendFormAction}
          pending={sendPending}
          onSuccess={handleSendSuccess}
        />
      ) : (
        <WhatsAppOTPVerifyForm
          phone={phone}
          verifyFormAction={handleVerifyFormAction}
          sendFormAction={handleSendFormAction}
          verifyPending={verifyPending}
          sendPending={sendPending}
          otpToken={otpToken}
          onSuccess={handleVerifySuccess}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
