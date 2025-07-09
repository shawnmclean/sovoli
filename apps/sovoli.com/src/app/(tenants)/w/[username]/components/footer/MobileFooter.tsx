"use client";

import { SiWhatsapp } from "@icons-pack/react-simple-icons";
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
  ImageIcon,
  MenuIcon,
  PhoneIcon,
  UsersIcon,
  BriefcaseIcon,
  InfoIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { tv } from "tailwind-variants";
import { WhatsAppLink } from "~/components/WhatsAppLink";
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

export interface MobileFooterProps {
  orgInstance: OrgInstance;
}

export function MobileFooter({ orgInstance }: MobileFooterProps) {
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const isHome = pathname === "/";
  const isPrograms = pathname === "/programs";
  const isGallery = pathname === "/gallery";
  const isMore = pathname === "/more";

  const footerButtonClasses = footerButton({ isSelected: isHome });
  const programsButtonClasses = footerButton({ isSelected: isPrograms });
  const galleryButtonClasses = footerButton({ isSelected: isGallery });
  const moreButtonClasses = footerButton({ isSelected: isMore });
  const drawerButtonClasses = drawerButton();

  const whatsappNumber = orgInstance.org.locations
    .find((location) => location.isPrimary)
    ?.contacts.find((contact) => contact.type === "whatsapp")?.value;

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
          <Button
            as={WhatsAppLink}
            phoneNumber={whatsappNumber}
            message={`Hi, I'm interested in your programs.`}
            page="mobile-footer"
            variant="shadow"
            color="primary"
            isIconOnly
            radius="md"
            className="-mt-8 mx-4"
            size="lg"
          >
            <SiWhatsapp className="text-xl" />
          </Button>
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <Button
            as={Link}
            href="https://www.facebook.com/profile.php?id=100063128446623&sk=photos"
            target="_blank"
            variant="light"
            color="default"
            size="sm"
            className={galleryButtonClasses.base()}
          >
            <ImageIcon className={galleryButtonClasses.icon()} />
            <span className={galleryButtonClasses.text()}>Gallery</span>
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
                    href="/workforce/people"
                    variant="light"
                    color="default"
                    size="sm"
                    className={drawerButtonClasses.base()}
                    onPress={onOpenChange}
                  >
                    <UsersIcon className={drawerButtonClasses.icon()} />
                    <span className={drawerButtonClasses.text()}>Team</span>
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
                </div>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </footer>
  );
}
