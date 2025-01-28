import Link from "next/link";
import { Badge } from "@sovoli/ui/components/badge";
import {
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
} from "@sovoli/ui/components/navbar";

import { auth } from "~/core/auth";
import { NavbarRightProfile } from "./NavbarRightProfile";
import { NewDropdown } from "./NewDropdown";
import { SignUpButton } from "./SignUpButton";

export interface NavbarProps {
  AppLinks?: React.ReactNode;
}

export const Navbar = async ({ AppLinks }: NavbarProps) => {
  const session = await auth();

  return (
    <NextUINavbar maxWidth="full">
      <div className="flex min-w-0 flex-row items-center gap-5">
        <NavbarItem className="shrink-0">
          <Link href="/" color="foreground">
            <Badge
              color="warning"
              content="v0"
              size="sm"
              title="Unstable Software"
              placement="bottom-right"
              variant="faded"
            >
              <p className="whitespace-nowrap font-bold text-inherit">Sovoli</p>
            </Badge>
          </Link>
        </NavbarItem>
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
          <NavbarItem>
            <SignUpButton />
          </NavbarItem>
        </NavbarContent>
      )}
    </NextUINavbar>
  );
};
