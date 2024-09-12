import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import type { AdapterSession } from "next-auth/adapters";
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
): Promise<NextAuthSession | DefaultSession | null> => {
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

// const validateJwtToken = async (
//   token: string,
// ): Promise<NextAuthSession | null> => {
//   const secureCookie = process.env.NODE_ENV === "production";
//   const decoded = await decode({
//     token,
//     secret: process.env.AUTH_SECRET ?? "secret",
//     salt: secureCookie
//       ? "__Secure-authjs.session-token"
//       : "authjs.session-token",
//   });

//   return decoded
//     ? {
//         user: {
//           username: decoded.email,
//         },
//         expires: new Date().toISOString(),
//       }
//     : null;
// };

// const validatePersonalAccessToken = async (
//   token: string,
// ): Promise<NextAuthSession | null> => {
//   // TODO: create a personal access token table and hash the token
//   // but for now, lets go with the user id as the token
//   const userToken = token.replace(PAT_PREFIX, ""); // Remove prefix
//   const user = await adapter.getUser?.(userToken);

//   return user
//     ? {
//         user: {
//           ...user,
//         },
//         expires: new Date().toISOString(),
//       }
//     : null;
// };

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
