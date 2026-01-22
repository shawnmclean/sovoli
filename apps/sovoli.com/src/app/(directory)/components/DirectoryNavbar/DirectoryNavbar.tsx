import {
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@sovoli/ui/components/navbar";
import Link from "next/link";

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
        <SearchBar placeholder="Search" />
      </NavbarContent>
    </Navbar>
  );
}
