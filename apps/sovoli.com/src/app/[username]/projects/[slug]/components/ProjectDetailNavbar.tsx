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

export interface ProjectDetailNavbarProps {
  title: string;
  orgName: string;
  backHref: string;
}

export function ProjectDetailNavbar({
  title,
  orgName,
  backHref,
}: ProjectDetailNavbarProps) {
  return (
    <Navbar
      maxWidth="full"
      className="absolute top-0 left-0 right-0 bg-transparent"
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
            href={backHref}
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
            title={title}
            text={`Check out ${title} on ${orgName}`}
            isIconOnly
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
