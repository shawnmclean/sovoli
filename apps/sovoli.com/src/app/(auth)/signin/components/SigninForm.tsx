"use client";

import { useActionState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";

import type { State } from "../actions/signinAction";
import { signinAction } from "../actions/signinAction";

export interface SigninFormProps {
  callbackUrl?: string;
}

export const SigninForm = ({ callbackUrl }: SigninFormProps) => {
  const [state, formAction, pending] = useActionState<State, FormData>(
    signinAction,
    null,
  );

  return (
    <Form
      className="flex flex-col gap-3"
      validationBehavior="native"
      action={formAction}
    >
      {callbackUrl && (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      )}
      <Input
        isRequired
        label="Email Address"
        name="email"
        placeholder="Enter your email"
        type="email"
        variant="bordered"
      />
      <Button
        className="w-full"
        color="primary"
        type="submit"
        isLoading={pending}
      >
        Join
      </Button>

      {state?.status === "error" && (
        <div className="text-red-500">{state.message}</div>
      )}
    </Form>
  );
};
