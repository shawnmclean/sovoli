import { tsr } from "@ts-rest/serverless/next";

import type { GlobalRequestContext } from "./router/identity/identityRouter";

function validateToken(authToken: string) {
  return { user: { id: authToken } };
}

function auth() {
  return null;
}

/**
 * Isomorphic Session getter for API requests
 * - Expo requests will have a session token in the Authorization header
 * - Next.js requests will have a session token in cookies
 */
const isomorphicGetSession = (headers: Headers) => {
  const authToken = headers.get("Authorization") ?? null;
  if (authToken) return validateToken(authToken);
  return auth();
};

export const authMiddleware = tsr.middleware<GlobalRequestContext>(
  (request) => {
    request.session = isomorphicGetSession(request.headers);
  },
);
