"use client";

import Link from "next/link";
import { ChevronLeftIcon, HeartIcon } from "lucide-react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@sovoli/ui/components/navbar";
import { Button } from "@sovoli/ui/components/button";
import type { OrgInstance } from "~/modules/organisations/types";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { ShareButton } from "./ShareButton";

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
          <ShareButton
            title={orgInstance.org.name}
            text={`Check out ${orgInstance.org.name} on Sovoli`}
          />
        </NavbarItem>
        <NavbarItem>
          <Button
            variant="flat"
            isIconOnly
            as={WhatsAppLink}
            message={`I'd like to vote for ${orgInstance.org.name}`}
            radius="full"
            intent="Add to Wishlist"
            userRole="parent"
            page="details"
            orgId={orgInstance.org.username}
            orgName={orgInstance.org.name}
            funnel="discovery"
          >
            <HeartIcon />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
