import type {
  SelectKnowledgeSchema,
  SelectUserSchema,
} from "@sovoli/db/schema";
import { auth } from "@sovoli/auth";

import { AuthNavbar } from "./AuthNavbar";
import { NavbarContext } from "./NavbarContext";
import { UnauthNavbar } from "./UnauthNavbar";

export interface NavbarProps {
  user?: SelectUserSchema;
  knowledge?: SelectKnowledgeSchema;
}

export async function Navbar({ user, knowledge }: NavbarProps) {
  const session = await auth();

  const navbarContextComponent = (
    <NavbarContext user={user} knowledge={knowledge} />
  );

  if (session) {
    return (
      <AuthNavbar
        session={session}
        NavbarContextComponent={navbarContextComponent}
      />
    );
  }
  return <UnauthNavbar NavbarContextComponent={navbarContextComponent} />;
}
