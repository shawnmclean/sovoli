import Link from "next/link";
import { auth } from "@sovoli/auth";
import { Badge } from "@sovoli/ui/components/ui/badge";
import {
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
} from "@sovoli/ui/components/ui/navbar";

import { NavbarRightProfile } from "./NavbarRightProfile";
import { SignInButton } from "./SignInButton";

export interface NavbarProps {
  AppLinks?: React.ReactNode;
}

export async function Navbar({ AppLinks }: NavbarProps) {
  const session = await auth();

  const navBarRightComponent = session ? (
    <NavbarRightProfile session={session} />
  ) : (
    <SignInButton />
  );

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

      <NavbarContent justify="end">
        <NavbarItem>{navBarRightComponent}</NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
}
