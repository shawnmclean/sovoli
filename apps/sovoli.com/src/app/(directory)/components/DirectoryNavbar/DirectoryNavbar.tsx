import Link from "next/link";
import { NavbarBrand, Navbar } from "@sovoli/ui/components/navbar";

import { Logo } from "~/components/Logo/Logo";

export function DirectoryNavbar() {
  return (
    <Navbar maxWidth="full">
      <div className="flex min-w-0 flex-row items-center gap-2">
        <Link href="/">
          <NavbarBrand className="flex items-center gap-1">
            <Logo />
          </NavbarBrand>
        </Link>
      </div>
    </Navbar>
  );
}
