import { auth } from "@sovoli/auth";

import { AuthNavbar } from "./AuthNavbar";
import { UnauthNavbar } from "./UnauthNavbar";

export async function Navbar() {
  const session = await auth();

  if (session) {
    return <AuthNavbar session={session} />;
  }
  return <UnauthNavbar />;
}
