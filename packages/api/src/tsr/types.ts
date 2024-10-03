import type { Session, User } from "@sovoli/auth";

export interface PlatformContext {
  auth: Session | null;
}

export interface TSRGlobalContext {
  session: Session | null;
}

export interface AuthUser extends User {
  id: string; // we're creating this interface to make sure the user has an id
}
export interface TSRAuthContext extends TSRGlobalContext {
  user: AuthUser;
}
