"use client";

import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
} from "@sovoli/ui/components/drawer";

import { Link } from "@sovoli/ui/components/link";
import {
  BookOpenIcon,
  HomeIcon,
  MenuIcon,
  PhoneIcon,
  UsersIcon,
  BriefcaseIcon,
  InfoIcon,
  ShoppingBagIcon,
  MessagesSquareIcon,
  CalendarIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { tv } from "tailwind-variants";
import type { OrgInstance } from "~/modules/organisations/types";

const footerButton = tv({
  slots: {
    base: "flex flex-col items-center justify-center h-16 w-16 text-foreground-500",
    icon: "text-sm mt-2",
    text: "text-xs mt-0.5",
  },
  variants: {
    isSelected: {
      true: {
        base: "border-t-2 border-primary-500",
        icon: "text-primary-500",
        text: "text-primary-500",
      },
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

const drawerButton = tv({
  slots: {
    base: "flex flex-col items-center justify-center h-20 w-20 text-foreground-500",
    icon: "text-xl mb-2",
    text: "text-xs",
  },
});

const footerCTAButton = tv({
  slots: {
    container: "flex flex-col items-center justify-center -mt-3 mx-4",
    label: "text-xs mt-1 text-foreground-500",
  },
  variants: {
    isSelected: {
      true: {
        label: "text-primary-500",
      },
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

export interface MobileFooterProps {
  orgInstance: OrgInstance;
}

export function MobileFooter() {
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const footerButtonClasses = footerButton({
    isSelected: pathname === "/" || pathname === "",
  });
  const programsButtonClasses = footerButton({
    isSelected: pathname === "/programs",
  });
  const teamButtonClasses = footerButton({
    isSelected: pathname.startsWith("/workforce/people"),
  });
  const ctaButtonClasses = footerCTAButton({
    isSelected: pathname.startsWith("/programs/apply"),
  });
  const moreButtonClasses = footerButton();
  const drawerButtonClasses = drawerButton();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-content1 shadow-lg pb-2 px-2 md:hidden z-40">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 justify-start gap-2">
          <Button
            as={Link}
            href="/"
            variant="light"
            color="default"
            size="sm"
            className={footerButtonClasses.base()}
          >
            <HomeIcon className={footerButtonClasses.icon()} />
            <span className={footerButtonClasses.text()}>Home</span>
          </Button>
          <Button
            as={Link}
            href="/programs"
            variant="light"
            color="default"
            size="sm"
            className={programsButtonClasses.base()}
          >
            <BookOpenIcon className={programsButtonClasses.icon()} />
            <span className={programsButtonClasses.text()}>Programs</span>
          </Button>
        </div>
        <div className="flex justify-center">
          <div className={ctaButtonClasses.container()}>
            <Button
              variant="shadow"
              color="primary"
              isIconOnly
              radius="md"
              size="lg"
              as={Link}
              href="/chat"
            >
              <MessagesSquareIcon className="text-xl" />
            </Button>
            <span className={ctaButtonClasses.label()}>Chat</span>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <Button
            as={Link}
            href="/workforce/people"
            variant="light"
            color="default"
            size="sm"
            className={teamButtonClasses.base()}
          >
            <UsersIcon className={teamButtonClasses.icon()} />
            <span className={teamButtonClasses.text()}>Team</span>
          </Button>
          <Button
            onPress={onOpen}
            variant="light"
            color="default"
            size="sm"
            className={moreButtonClasses.base()}
          >
            <MenuIcon className={moreButtonClasses.icon()} />
            <span className={moreButtonClasses.text()}>More</span>
          </Button>
          <Drawer
            isOpen={isOpen}
            placement="bottom"
            backdrop="opaque"
            hideCloseButton
            onOpenChange={onOpenChange}
            motionProps={{
              variants: {
                enter: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.3,
                  },
                },
                exit: {
                  y: 100,
                  opacity: 0,
                  transition: {
                    duration: 0.3,
                  },
                },
              },
            }}
          >
            <DrawerContent>
              <DrawerBody>
                <div className="grid grid-cols-2 gap-6 p-6">
                  <Button
                    as={Link}
                    href="/contact"
                    variant="light"
                    color="default"
                    size="sm"
                    className={drawerButtonClasses.base()}
                    onPress={onOpenChange}
                  >
                    <PhoneIcon className={drawerButtonClasses.icon()} />
                    <span className={drawerButtonClasses.text()}>Contact</span>
                  </Button>
                  <Button
                    as={Link}
                    href="/events"
                    variant="light"
                    color="default"
                    size="sm"
                    className={drawerButtonClasses.base()}
                    onPress={onOpenChange}
                  >
                    <CalendarIcon className={drawerButtonClasses.icon()} />
                    <span className={drawerButtonClasses.text()}>Events</span>
                  </Button>
                  <Button
                    as={Link}
                    href="/workforce/positions"
                    variant="light"
                    color="default"
                    size="sm"
                    className={drawerButtonClasses.base()}
                    onPress={onOpenChange}
                  >
                    <BriefcaseIcon className={drawerButtonClasses.icon()} />
                    <span className={drawerButtonClasses.text()}>Jobs</span>
                  </Button>
                  <Button
                    as={Link}
                    href="/about"
                    variant="light"
                    color="default"
                    size="sm"
                    className={drawerButtonClasses.base()}
                    onPress={onOpenChange}
                  >
                    <InfoIcon className={drawerButtonClasses.icon()} />
                    <span className={drawerButtonClasses.text()}>About</span>
                  </Button>
                  <Button
                    as={Link}
                    href="/suppliers/student-supplies"
                    variant="light"
                    color="default"
                    size="sm"
                    className={drawerButtonClasses.base()}
                    onPress={onOpenChange}
                  >
                    <ShoppingBagIcon className={drawerButtonClasses.icon()} />
                    <span className={drawerButtonClasses.text()}>
                      Suppliers
                    </span>
                  </Button>
                </div>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </footer>
  );
}
