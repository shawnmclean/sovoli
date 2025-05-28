"use client";

import { Button } from "@sovoli/ui/components/button";
import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";

export interface SigninFormProps {
  callbackUrl?: string;
}

export const SigninForm = ({ callbackUrl }: SigninFormProps) => {
  return (
    <Form
      className="flex flex-col gap-3"
      validationBehavior="native"
      data-attr="signin-submit"
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
        isDisabled
      />
      <Button
        className="w-full"
        color="primary"
        type="submit"
        data-attr="signup"
        isDisabled
      >
        Sign In
      </Button>
    </Form>
  );
};
