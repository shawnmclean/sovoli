"use client";

import { Avatar } from "@sovoli/ui/components/avatar";
import { Link } from "@sovoli/ui/components/link";
import { Navbar, NavbarBrand } from "@sovoli/ui/components/navbar";
import type { OrgInstance } from "~/modules/organisations/types";

export interface AdminSchoolHeaderProps {
  orgInstance: OrgInstance;
}

export function AdminSchoolHeader({ orgInstance }: AdminSchoolHeaderProps) {
  return (
    <Navbar
      maxWidth="full"
      position="static"
      className="border-b border-default-200"
    >
      <NavbarBrand>
        <Link href={`/${orgInstance.org.username}`}>
          <Avatar
            src={orgInstance.org.logoPhoto?.url}
            name={orgInstance.org.name}
            size="md"
            className="h-10 w-10"
            fallback={
              <span className="text-xs text-default-500">
                Logo Not Available
              </span>
            }
          />
        </Link>
      </NavbarBrand>
    </Navbar>
  );
}
