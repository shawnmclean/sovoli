import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@sovoli/db";
import NextAuth from "next-auth";
import Passkey from "next-auth/providers/passkey";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Passkey({
      formFields: {
        username: {
          label: "Username",
          required: true,
          autocomplete: "username webauthn",
        },
        email: {
          label: "Email",
          required: true,
          autocomplete: "email webauthn",
        },
      },
    }),
  ],
  adapter: DrizzleAdapter(db),

  experimental: {
    enableWebAuthn: true,
  },
});
