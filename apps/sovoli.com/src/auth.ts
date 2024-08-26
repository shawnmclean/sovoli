import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@sovoli/db";
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Resend({
      from: "hello@sovoli.com",
    }),
  ],
  adapter: DrizzleAdapter(db),
});
