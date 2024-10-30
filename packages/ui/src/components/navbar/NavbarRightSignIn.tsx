"use client";

import { signIn } from "next-auth/react";

import { Button } from "../ui/button";

export const NavbarRightSignIn = () => (
  <Button color="primary" onClick={() => signIn()}>
    Sign In
  </Button>
);
