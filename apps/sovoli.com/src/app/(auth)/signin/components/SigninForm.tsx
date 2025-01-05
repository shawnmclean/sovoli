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
    <Form className="w-full" action={formAction}>
      {callbackUrl && (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      )}
      <Input
        placeholder="Email"
        name="email"
        fullWidth
        size="lg"
        type="email"
        variant="bordered"
        classNames={{
          input: "font-bold text-3xl",
        }}
      />

      <div className="flex gap-2">
        <Button color="primary" type="submit" isLoading={pending}>
          Create
        </Button>
      </div>
      {state?.status === "error" && (
        <div className="text-red-500">{state.message}</div>
      )}
    </Form>
  );
};
