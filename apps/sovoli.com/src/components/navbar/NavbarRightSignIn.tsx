"use client";

import { Button } from "@sovoli/ui/components/ui/button";
import { signIn } from "next-auth/react";

export const NavbarRightSignIn = () => (
  <Button color="primary" onClick={() => signIn()}>
    Sign In
  </Button>
);
