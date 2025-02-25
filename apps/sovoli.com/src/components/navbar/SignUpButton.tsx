"use client";

import NextLink from "next/link";
import { Button } from "@sovoli/ui/components/button";

export const SignUpButton = () => {
  return (
    <Button
      data-attr="signup"
      color="primary"
      href="/signin"
      as={NextLink}
      size="sm"
    >
      Sign In
    </Button>
  );
};
