"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import type { VerifyState } from "../actions/verifyOTPAction";
import type { State } from "../actions/sendOTPAction";

export interface WhatsAppOTPVerifyFormProps {
  phone: string;
  verifyFormAction: (formData: FormData) => Promise<VerifyState>;
  sendFormAction: (formData: FormData) => Promise<State>;
  verifyPending: boolean;
  sendPending: boolean;
  otpToken?: string;
  onSuccess?: (phone: string) => void;
  onBack?: () => void;
}

export function WhatsAppOTPVerifyForm({
  phone,
  verifyFormAction,
  sendFormAction,
  verifyPending,
  sendPending,
  otpToken,
  onSuccess,
  onBack,
}: WhatsAppOTPVerifyFormProps) {
  const [otp, setOtp] = useState("");
  const [verifyState, setVerifyState] = useState<VerifyState>(null);

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("otp", otp);
    formData.append("phone", phone);
    if (otpToken) {
      formData.append("otpToken", otpToken);
    }

    const result = await verifyFormAction(formData);
    setVerifyState(result);

    if (result?.status === "success") {
      onSuccess?.(phone);
    }
  };

  const handleResend = async () => {
    const formData = new FormData();
    formData.append("phone", phone);

    await sendFormAction(formData);
    setOtp("");
    setVerifyState(null);
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

      <form onSubmit={handleVerifySubmit} className="space-y-4">
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
            isDisabled={verifyPending}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>

        {/* Verification state messages */}
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

        <Button
          type="submit"
          variant="solid"
          color="primary"
          radius="lg"
          fullWidth
          isLoading={verifyPending}
          isDisabled={verifyPending || !otp.trim()}
        >
          {verifyPending ? "Verifying..." : "Verify"}
        </Button>
      </form>

      <div className="flex flex-col gap-2">
        <Button
          variant="light"
          color="primary"
          radius="lg"
          fullWidth
          isLoading={sendPending}
          isDisabled={sendPending}
          onPress={handleResend}
        >
          {sendPending ? "Sending..." : "Resend code"}
        </Button>

        {onBack && (
          <Button
            variant="light"
            radius="lg"
            fullWidth
            onPress={onBack}
            isDisabled={verifyPending || sendPending}
          >
            Change phone number
          </Button>
        )}
      </div>
    </div>
  );
}
