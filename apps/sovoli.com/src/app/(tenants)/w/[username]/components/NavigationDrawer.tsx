"use client";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import type { Program } from "~/modules/academics/types";

interface NavigationDrawerProps {
  program: Program;
  children: React.ReactNode;
}

export function NavigationDrawer({ program, children }: NavigationDrawerProps) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment("modals");
  const { isOpen, onClose } = useDisclosure({
    defaultOpen: segment !== null,
    isOpen: segment !== null,
  });

  const handleClose = () => {
    onClose();
    if (history.length <= 2) {
      router.push(`/programs/${program.slug}`);
    } else {
      router.back();
    }
  };
  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={handleClose}
      onClose={handleClose}
      size="full"
      placement="bottom"
      backdrop="opaque"
      hideCloseButton
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
        <DrawerHeader showBackButton onBackPress={handleClose} />
        <DrawerBody>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
