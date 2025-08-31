"use client";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
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

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={() => {
        onClose();
        // use 2 because the first page may be the browser's default page
        if (history.length <= 2) {
          router.push(`/programs/${program.slug}`);
        } else {
          router.back();
        }
      }}
      size="full"
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
        <DrawerBody className="mt-4">{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
