import type { DefaultSession, NextAuthConfig, Session as NextAuthSession } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@sovoli/db";
// import {
//   accounts,
//   sessions,
//   users,
//   verificationTokens,
// } from "@sovoli/db/schema";
import Resend from "next-auth/providers/resend";


const adapter = DrizzleAdapter(db);

export const authConfig: NextAuthConfig = {
  adapter,
  providers: [
    Resend({
      from: "hello@sovoli.com",
    }),
  ],
  callbacks: {
    session({ session, user }) {
      // `session.user.address` is now a valid property, and will be type-checked
      // in places like `useSession().data.user` or `auth().user`
      return {
        ...session,
        user: {
          ...session.user,
          username: user.username,
        },
      };
    },
  },
}

export const validateToken = async (
    token: string,
  ): Promise<NextAuthSession | null> => {
    const sessionToken = token.slice("Bearer ".length);
    const session = await adapter.getSessionAndUser?.(sessionToken);
    return session
      ? {
          user: {
            ...session.user,
          },
          expires: session.session.expires.toISOString(),
        }
      : null;
  };


declare module "next-auth" {
  interface User {
    username: string;
  }
  interface Session {
    user: {
      username: string;
    } & DefaultSession["user"];
  }
}