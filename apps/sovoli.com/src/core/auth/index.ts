import NextAuth from "next-auth";

import { authConfig } from "./config";

export type { Session, User } from "next-auth";

const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { handlers, auth, signIn, signOut };

export { validateToken } from "./config";
