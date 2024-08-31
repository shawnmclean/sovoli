import type { Session, User } from "@sovoli/auth";

export interface TSRGlobalContext {
  session: Session | null;
}

export interface TSRAuthContext {
  user: User;
}
