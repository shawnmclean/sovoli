"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { Button } from "@sovoli/ui/components/button";
import { InputOtp } from "@sovoli/ui/components/input-otp";
import type { VerifyState } from "../actions/verifyOTPAction";
import type { State } from "../actions/sendOTPAction";
import { Form } from "@sovoli/ui/components/form";
import { ArrowLeft } from "lucide-react";

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
  onBack,
}: WhatsAppOTPVerifyFormProps) {
  const [verifyState, verifyFormAction, isVerifyPending] = useActionState(
    verifyAction,
    null,
  );
  const [resendState, resendFormAction, isSendPending] = useActionState(
    sendAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [countdown, setCountdown] = useState(60);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset countdown when resend is successful
  useEffect(() => {
    if (resendState?.status === "success") {
      setCountdown(60);
    }
  }, [resendState]);

  return (
    <div className="space-y-6">
      {/* Back button - top left */}
      {onBack && (
        <div className="flex justify-start">
          <Button
            variant="light"
            size="sm"
            isIconOnly
            onPress={onBack}
            isDisabled={isVerifyPending || isSendPending}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className="text-left">
        <h1 className="text-2xl font-bold mb-2">Verify your phone number</h1>
        <p className="text-base">
          We sent a 6 digit code to <strong>{phone}</strong>
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

      {resendState && (
        <div
          className={`p-3 rounded-lg ${
            resendState.status === "success"
              ? "bg-success-50 text-success-700 border border-success-200"
              : "bg-danger-50 text-danger-700 border border-danger-200"
          }`}
        >
          {resendState.message}
        </div>
      )}

      <Form
        ref={formRef}
        action={verifyFormAction}
        className="w-full flex justify-center items-center"
        validationErrors={verifyState?.errors}
      >
        <input name="phone" defaultValue={phone} type="hidden" />
        <input name="otpToken" defaultValue={otpToken} type="hidden" />
        <InputOtp
          name="otp"
          length={6}
          autoFocus
          size="lg"
          variant="bordered"
          isRequired
          isDisabled={isVerifyPending}
          onComplete={() => {
            // Trigger form submission when OTP is complete
            formRef.current?.requestSubmit();
          }}
        />
      </Form>

      {/* Resend section - below input with countdown */}
      <div className="flex justify-between items-center">
        <Form action={resendFormAction}>
          <input name="phone" defaultValue={phone} type="hidden" />
          <Button
            variant="light"
            color="primary"
            size="sm"
            isLoading={isSendPending}
            isDisabled={isSendPending || countdown > 0}
            type="submit"
          >
            {isSendPending ? "Sending..." : "Resend code"}
          </Button>
        </Form>

        {/* Countdown timer */}
        <div className="text-sm text-default-500">
          {countdown > 0 ? `Resend in ${countdown}s` : "Ready to resend"}
        </div>
      </div>
    </div>
  );
}
