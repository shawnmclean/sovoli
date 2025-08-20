"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";

import { gradientBorderButton } from "~/components/GradientBorderButton";
import { signInAction } from "../actions/signInAction";
import type { State } from "../actions/signInAction";

export interface WhatsAppOTPFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function WhatsAppOTPForm({ onSuccess, onError }: WhatsAppOTPFormProps) {
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<State>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      setState({
        status: "error",
        message: "Please enter a phone number",
      });
      return;
    }

    setIsSubmitting(true);
    setState(null);

    try {
      const formData = new FormData();
      formData.append("phone", phone.trim());

      const result = await signInAction(null, formData);
      setState(result);

      if (result?.status === "success") {
        onSuccess?.();
        // Reset form on success
        setPhone("");
      } else if (result?.status === "error") {
        onError?.(result.message);
      }
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      setState({
        status: "error",
        message: errorMessage,
      });
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        autoFocus
        type="tel"
        size="lg"
        variant="bordered"
        placeholder="Enter your phone number"
        isRequired
        isDisabled={isSubmitting}
      />

      {/* Action state messages */}
      {state && (
        <div
          className={`p-3 rounded-lg ${
            state.status === "success"
              ? "bg-success-50 text-success-700 border border-success-200"
              : "bg-danger-50 text-danger-700 border border-danger-200"
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          variant="shadow"
          radius="lg"
          className={gradientBorderButton()}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send WhatsApp Message"}
        </Button>
      </div>
    </form>
  );
}
