"use client";

import { Button } from "@sovoli/ui/components/button";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@sovoli/ui/components/navbar";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "~/app/[username]/(profile)/components/OrgNavbar/ShareButton";
import type { Service } from "~/modules/services/types";
import type { OrgInstance } from "~/modules/organisations/types";

export interface ServiceDetailMobileNavbarProps {
  orgInstance: OrgInstance;
  service: Service;
}

export function ServiceDetailMobileNavbar({
  orgInstance,
  service,
}: ServiceDetailMobileNavbarProps) {
  return (
    <Navbar
      maxWidth="full"
      className="absolute top-0 left-0 right-0 bg-transparent md:hidden"
      isBordered={false}
      isBlurred={false}
      classNames={{
        wrapper: "px-4",
      }}
    >
      <NavbarContent justify="start">
        <NavbarItem>
          <Button
            as={Link}
            href="/services"
            variant="solid"
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
            variant="solid"
            title={service.name}
            text={`Check out ${service.name} on ${orgInstance.org.name}`}
            isIconOnly
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
