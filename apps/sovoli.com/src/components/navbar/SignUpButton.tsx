"use client";

import NextLink from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { useFeatureFlagVariantKey } from "posthog-js/react";

export const SignUpButton = () => {
  const variant = useFeatureFlagVariantKey("signup-clicks-conversions");
  return (
    <Button data-attr="signup" color="primary" href="/signin" as={NextLink}>
      {variant === "subscribe" ? "Subscribe" : "Sign In"}
    </Button>
  );
};
