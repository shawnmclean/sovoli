import { Button } from "@sovoli/ui/components/button";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@sovoli/ui/components/navbar";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "~/app/[username]/(profile)/components/OrgNavbar/ShareButton";
import type { Event } from "~/modules/events/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { SubscribeEventButton } from "../SubscribeEventButton";

export interface EventDetailNavbarProps {
  orgInstance: OrgInstance;
  event: Event;
}

export function EventDetailNavbar({
  orgInstance,
  event,
}: EventDetailNavbarProps) {
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
            href="/events"
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
            title={event.name}
            text={`Check out ${event.name} on ${orgInstance.org.name}`}
            isIconOnly
          />
        </NavbarItem>
        <NavbarItem>
          <SubscribeEventButton event={event} orgInstance={orgInstance} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
