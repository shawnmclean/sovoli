import type { Session, User } from "@sovoli/auth";

export interface PlatformContext {
  auth: Session | null;
}

export interface TSRGlobalContext {
  session: Session | null;
}

export interface TSRAuthContext extends TSRGlobalContext {
  user: User;
}
