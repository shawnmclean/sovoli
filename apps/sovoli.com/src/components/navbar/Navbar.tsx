import Link from "next/link";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
} from "@sovoli/ui/components/navbar";

import { auth } from "~/core/auth";
import { Logo } from "../Logo/Logo";
import { NavbarRightProfile } from "./NavbarRightProfile";
import { NewDropdown } from "./NewDropdown";

// import { SignUpButton } from "./SignUpButton";

export interface NavbarProps {
  AppLinks?: React.ReactNode;
}

export const Navbar = async ({ AppLinks }: NavbarProps) => {
  const session = await auth();

  return (
    <NextUINavbar maxWidth="full">
      <div className="flex min-w-0 flex-row items-center gap-2">
        <Link href="/">
          <NavbarBrand className="flex items-center gap-1">
            <Logo />
            <p className="hidden font-bold text-inherit md:block">Sovoli</p>
          </NavbarBrand>
        </Link>
        <NavbarItem className="overflow-hidden">{AppLinks}</NavbarItem>
      </div>

      {session ? (
        <NavbarContent justify="end">
          <NavbarItem>
            <NewDropdown />
          </NavbarItem>
          <NavbarItem>
            <NavbarRightProfile session={session} />
          </NavbarItem>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem>{/* <SignUpButton /> */}</NavbarItem>
        </NavbarContent>
      )}
    </NextUINavbar>
  );
};
