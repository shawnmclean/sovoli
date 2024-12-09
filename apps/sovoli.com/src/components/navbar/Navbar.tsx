import Link from "next/link";
import { auth } from "@sovoli/auth";
import { Chip } from "@sovoli/ui/components/ui/chip";
import {
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
} from "@sovoli/ui/components/ui/navbar";

import { NavbarRightProfile } from "./NavbarRightProfile";
import { NavbarRightSignIn } from "./NavbarRightSignIn";

export interface NavbarProps {
  AppLinks?: React.ReactNode;
}

export async function Navbar({ AppLinks }: NavbarProps) {
  const session = await auth();

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
        <NavbarItem className="overflow-hidden">{AppLinks}</NavbarItem>
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
