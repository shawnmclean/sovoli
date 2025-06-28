import Link from "next/link";
import { ChevronLeftIcon, ShareIcon, HeartIcon } from "lucide-react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@sovoli/ui/components/navbar";
import { Button } from "@sovoli/ui/components/button";
import type { OrgInstance } from "~/modules/organisations/types";
import { WhatsAppLink } from "~/components/WhatsAppLink";

export interface OrgNavbarProps {
  orgInstance: OrgInstance;
}

export function OrgNavbar({ orgInstance }: OrgNavbarProps) {
  return (
    <Navbar maxWidth="full">
      <NavbarContent justify="start">
        <NavbarItem>
          <Button
            as={Link}
            href="/d/private-school/guyana"
            variant="flat"
            isIconOnly
            radius="full"
          >
            <ChevronLeftIcon />
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button variant="flat" isIconOnly radius="full">
            <ShareIcon />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            variant="flat"
            isIconOnly
            as={WhatsAppLink}
            message={`I'd like to vote for ${orgInstance.org.name}`}
            radius="full"
          >
            <HeartIcon />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
