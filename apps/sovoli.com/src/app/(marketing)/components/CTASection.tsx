"use client";

import React, { useActionState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { ArrowRightIcon } from "lucide-react";

import { insertWaitlistContactAction } from "../actions/insertWaitlistContactAction";
import { ContactToggleInput } from "./ContactToggleInput";

const initialState = null;
export function CTASection() {
  const [state, formAction, isPending] = useActionState(
    insertWaitlistContactAction,
    initialState,
  );

  return (
    <section className="mt-6 flex flex-col items-center">
      <div className="w-full max-w-md animate-neonPulse rounded-xl border-2 border-purple-500 p-6 shadow-lg backdrop-blur-md">
        <h2 className="mb-4 text-center text-2xl font-bold text-default-900">
          Get early access
        </h2>{" "}
        {/* Outcome Framing */}
        <p className="my-4 text-center text-sm text-default-400 sm:text-base">
          Find out if Sovoli aligns — and how to step in early.
        </p>
        <form action={formAction} className="flex flex-col gap-6">
          <ContactToggleInput
            defaultMode="whatsapp"
            defaultValue=""
            renderAfterInput={
              <Button
                type="submit"
                className="h-10 w-full text-sm font-medium sm:w-[140px]"
                isLoading={isPending}
                color="primary"
                endContent={<ArrowRightIcon className="h-4 w-4" />}
              >
                Proceed
              </Button>
            }
          />
        </form>
        {state?.status === "error" && (
          <p
            className="mt-4 text-center text-sm font-medium text-red-500"
            role="alert"
          >
            {state.message}
          </p>
        )}
        <p className="mt-2 text-center text-xs text-default-400">
          Takes less than 1 minute.
        </p>
      </div>

      {/* 👇 Pain/Benefit Block Moved Here */}
      <p className="mt-6 max-w-md text-center text-sm text-default-500 sm:text-base">
        Admins spend hours pulling records from different places — every week,
        every term. Sovoli keeps it all in one place, always up to date.
      </p>
    </section>
  );
}
