import type {
  SelectKnowledgeSchema,
  SelectUserSchema,
} from "@sovoli/db/schema";
import { auth } from "@sovoli/auth";

import { Chip } from "../ui/chip";
import { Link } from "../ui/link";
import {
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
} from "../ui/navbar";
import { NavbarAppLinks } from "./NavbarAppLinks";
import { NavbarRightProfile } from "./NavbarRightProfile";
import { NavbarRightSignIn } from "./NavbarRightSignIn";

export interface NavbarProps {
  user?: SelectUserSchema;
  knowledge?: SelectKnowledgeSchema;
}

export async function Navbar({ user, knowledge }: NavbarProps) {
  const session = await auth();

  const appLinksComponent = (
    <NavbarAppLinks user={user} knowledge={knowledge} />
  );

  const navBarRightComponent = session ? (
    <NavbarRightProfile session={session} />
  ) : (
    <NavbarRightSignIn />
  );

  return (
    <NextUINavbar maxWidth="full">
      <div className="flex min-w-0 flex-row items-center gap-4">
        <NavbarItem className="shrink-0">
          <Link href="/" color="foreground">
            {/* Logo Image here */}
            <p className="whitespace-nowrap font-bold text-inherit">Sovoli</p>
          </Link>
        </NavbarItem>
        <NavbarItem className="overflow-hidden">{appLinksComponent}</NavbarItem>
      </div>

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <Chip color="warning" variant="dot">
            Reworking Design System
          </Chip>
        </NavbarItem>
        <NavbarItem>{navBarRightComponent}</NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
}
