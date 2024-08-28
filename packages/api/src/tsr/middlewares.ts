import { tsr } from "@ts-rest/serverless/next";

import type { GlobalRequestContext } from "./router/identity/identityRouter";

// Temp until we move the auth into its own package
function validateToken(authToken: string) {
  return { user: { id: authToken } };
}
// Temp until we move the auth into its own package
function auth() {
  return null;
}

/**
 * Isomorphic Session getter for API requests
 * - Expo requests will have a session token in the Authorization header
 * - Next.js requests will have a session token in cookies
 * See: https://github.com/t3-oss/create-t3-turbo/blob/8ca45cd2b06096c14d36a713dce32d7afcb1fed7/packages/api/src/trpc.ts#L22
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
