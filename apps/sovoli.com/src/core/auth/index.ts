import type { DefaultSession, Session as NextAuthSession } from "next-auth";
import type { AdapterSession } from "next-auth/adapters";
import { skipCSRFCheck } from "@auth/core";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, schema } from "@sovoli/db";
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";

import { getPostHogClient } from "../posthog/posthog";

const adapter = DrizzleAdapter(db, {
  usersTable: schema.User,
  accountsTable: schema.Account,
  sessionsTable: schema.Session,
  verificationTokensTable: schema.VerificationToken,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    Resend({
      from: "hello@sovoli.com",
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    session({ session }) {
      return {
        ...session,
        user: {
          ...session.user,
        },
      };
    },
  },
  events: {
    async createUser(message) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: message.user.id ?? "",
        event: "User Created",
        properties: {
          email: message.user.email,
        },
      });
      await posthog.shutdown();
    },
  },
  session: {
    strategy: "database",
  },
  // no need for csfr in server actions: https://nextjs.org/blog/security-nextjs-server-components-actions#csrf
  skipCSRFCheck: skipCSRFCheck,
});

// const PAT_PREFIX = "sop_";
/**
 * Validate a session token
 * @param sessionToken the session token
 * @returns
 */
export const validateToken = async (
  sessionToken: string,
): Promise<NextAuthSession | null> => {
  const session = await adapter.getSessionAndUser?.(sessionToken);

  return session
    ? {
        ...session.session,
        expires: session.session.expires.toISOString(),
        user: {
          ...session.user,
        },
      }
    : null;
};

declare module "next-auth" {
  interface User {
    username?: string | null;
  }
  interface Session extends AdapterSession {
    user: DefaultSession["user"];
  }
}
