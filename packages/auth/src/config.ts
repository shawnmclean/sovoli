import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import type { AdapterSession } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, schema } from "@sovoli/db";
import Resend from "next-auth/providers/resend";

const adapter = DrizzleAdapter(db, {
  usersTable: schema.users,
  accountsTable: schema.accounts,
  sessionsTable: schema.sessions,
  verificationTokensTable: schema.verificationTokens,
});

export const authConfig: NextAuthConfig = {
  adapter,
  providers: [
    Resend({
      from: "hello@sovoli.com",
    }),
  ],
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
  session: {
    strategy: "database",
  },
};

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
    username: string;
  }
  interface Session extends AdapterSession {
    user: {
      username: string;
    } & DefaultSession["user"];
  }
}
