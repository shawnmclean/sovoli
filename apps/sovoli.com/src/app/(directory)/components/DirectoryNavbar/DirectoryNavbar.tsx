import Link from "next/link";
import {
  NavbarBrand,
  Navbar,
  NavbarContent,
} from "@sovoli/ui/components/navbar";

import { Logo } from "~/components/Logo/Logo";
import { SearchBar } from "./SearchBar";

export function DirectoryNavbar() {
  return (
    <Navbar maxWidth="full">
      <Link href="/">
        <NavbarBrand className="flex items-center gap-1">
          <Logo />
        </NavbarBrand>
      </Link>

      <NavbarContent>
        <SearchBar placeholder="Private Schools in Guyana" />
      </NavbarContent>
    </Navbar>
  );
}
