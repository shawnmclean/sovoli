"use client";

import React, { useActionState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { ArrowRightIcon } from "lucide-react";

import type { State } from "../actions/insertWaitlistContactAction";
import { insertWaitlistContactAction } from "../actions/insertWaitlistContactAction";
import { ContactToggleInput } from "./ContactToggleInput";

const initialState = null;

export function WaitlistForm() {
  const [state, formAction, isPending] = useActionState<State, FormData>(
    insertWaitlistContactAction,
    initialState,
  );

  return (
    <div className="w-full max-w-md animate-neonPulse rounded-xl border-2 border-purple-500 p-8 backdrop-blur-md">
      <h2 className="mb-6 text-center text-2xl font-bold">
        Start the Compatibility Survey
      </h2>

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
              endContent={<ArrowRightIcon />}
            >
              Start
            </Button>
          }
        />
      </form>

      {state?.status === "error" && (
        <div className="mt-4 text-sm text-red-500">{state.message}</div>
      )}
    </div>
  );
}
