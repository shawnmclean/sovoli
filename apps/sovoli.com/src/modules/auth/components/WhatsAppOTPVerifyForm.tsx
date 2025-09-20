"use client";

import { useState, useActionState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import type { VerifyState } from "../actions/verifyOTPAction";
import type { State } from "../actions/sendOTPAction";

export interface WhatsAppOTPVerifyFormProps {
  phone: string;
  verifyAction: (
    prevState: VerifyState,
    formData: FormData,
  ) => Promise<VerifyState>;
  sendAction: (prevState: State, formData: FormData) => Promise<State>;
  otpToken?: string;
  onSuccess?: (phone: string) => void;
  onError?: (message: string) => void;
  onBack?: () => void;
}

export function WhatsAppOTPVerifyForm({
  phone,
  verifyAction,
  sendAction,
  otpToken,
  onSuccess,
  onError,
  onBack,
}: WhatsAppOTPVerifyFormProps) {
  const [verifyState, verifyFormAction, isVerifyPending] = useActionState(
    verifyAction,
    null,
  );
  const [sendState, sendFormAction, isSendPending] = useActionState(
    sendAction,
    null,
  );
  const [otp, setOtp] = useState("");

  // Handle verify state changes
  useEffect(() => {
    if (verifyState?.status === "success") {
      onSuccess?.(phone);
    } else if (verifyState?.status === "error") {
      onError?.(verifyState.message);
    }
  }, [verifyState, phone, onSuccess, onError]);

  // Handle send state changes (for resend)
  useEffect(() => {
    if (sendState?.status === "error") {
      onError?.(sendState.message);
    }
    // Clear OTP when resending
    if (sendState?.status === "success") {
      setOtp("");
    }
  }, [sendState, onError]);

  const handleVerifySubmit = (formData: FormData) => {
    formData.set("otp", otp);
    formData.set("phone", phone);
    if (otpToken) {
      formData.set("otpToken", otpToken);
    }
    verifyFormAction(formData);
  };

  const handleResend = () => {
    const formData = new FormData();
    formData.set("phone", phone);
    sendFormAction(formData);
  };

  const formatPhoneForDisplay = (phone: string) => {
    // Simple formatting - in production you might want more sophisticated formatting
    if (phone.length > 4) {
      const start = phone.slice(0, -4);
      return `${start}****`;
    }
    return phone;
  };

  return (
    <div className="space-y-4">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">Enter verification code</h1>
        <p className="text-base">
          We sent a code to {formatPhoneForDisplay(phone)}
        </p>
      </div>

      {/* Display state messages */}
      {verifyState && (
        <div
          className={`p-3 rounded-lg ${
            verifyState.status === "success"
              ? "bg-success-50 text-success-700 border border-success-200"
              : "bg-danger-50 text-danger-700 border border-danger-200"
          }`}
        >
          {verifyState.message}
        </div>
      )}

      {sendState && (
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

      <form action={handleVerifySubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Input
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            autoFocus
            type="text"
            size="lg"
            variant="bordered"
            placeholder="Enter verification code"
            isRequired
            isDisabled={isVerifyPending}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>

        <Button
          type="submit"
          variant="solid"
          color="primary"
          radius="lg"
          fullWidth
          isLoading={isVerifyPending}
          isDisabled={isVerifyPending || !otp.trim()}
        >
          {isVerifyPending ? "Verifying..." : "Verify"}
        </Button>
      </form>

      <div className="flex flex-col gap-2">
        <Button
          variant="light"
          color="primary"
          radius="lg"
          fullWidth
          isLoading={isSendPending}
          isDisabled={isSendPending}
          onPress={handleResend}
        >
          {isSendPending ? "Sending..." : "Resend code"}
        </Button>

        {onBack && (
          <Button
            variant="light"
            radius="lg"
            fullWidth
            onPress={onBack}
            isDisabled={isVerifyPending || isSendPending}
          >
            Change phone number
          </Button>
        )}
      </div>
    </div>
  );
}
