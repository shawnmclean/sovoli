"use client";

import React, { useActionState, useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { ArrowRightIcon, MailIcon, PhoneIcon } from "lucide-react";

import type { State } from "../actions/insertWaitlistContactAction";
import { insertWaitlistContactAction } from "../actions/insertWaitlistContactAction";

const initialState = null;

export function WaitlistForm() {
  const [mode, setMode] = useState<"whatsapp" | "email">("whatsapp");
  const [state, formAction, isPending] = useActionState<State, FormData>(
    insertWaitlistContactAction,
    initialState,
  );

  return (
    <div className="animate-neonPulse flex w-full max-w-md flex-col items-center gap-6 rounded-xl border-2 border-purple-500 p-8 backdrop-blur-md">
      <h2 className="text-center text-2xl font-bold">
        Start the Compatibility Survey
      </h2>

      {/* Toggle Pill Group */}
      <div className="flex justify-center rounded-full border border-default-100 p-1">
        {["whatsapp", "email"].map((type) => {
          const isActive = mode === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setMode(type as "whatsapp" | "email")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-default-foreground text-background"
                  : "text-default-500 hover:bg-default-100"
              }`}
            >
              {type === "whatsapp" ? "WhatsApp" : "Email"}
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form
        action={formAction}
        className="flex w-full flex-col items-center gap-3 sm:flex-row sm:gap-4"
      >
        {mode === "email" ? (
          <Input
            name="contactValue"
            type="email"
            placeholder="Your email address"
            required
            className="h-10 w-full text-sm sm:w-[260px]"
            startContent={<MailIcon className="text-default-400" />}
          />
        ) : (
          <Input
            name="contactValue"
            type="tel"
            placeholder="Your WhatsApp number"
            required
            className="h-10 w-full text-sm sm:w-[260px]"
            startContent={<PhoneIcon className="text-default-400" />}
          />
        )}

        {/* Hidden Mode Input */}
        <input type="hidden" name="mode" value={mode} />

        <Button
          type="submit"
          className="h-10 w-full text-sm font-medium sm:w-[140px]"
          isLoading={isPending}
          color="primary"
          endContent={<ArrowRightIcon />}
        >
          Start
        </Button>
      </form>

      {/* Optional Error Display */}
      {state?.status === "error" && (
        <div className="mt-4 text-sm text-red-500">{state.message}</div>
      )}
    </div>
  );
}
