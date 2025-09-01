"use client";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Program } from "~/modules/academics/types";

interface NavigationDrawerProps {
  program: Program;
  children: React.ReactNode;
}

export function NavigationDrawer({ program, children }: NavigationDrawerProps) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment("modals");
  const { isOpen, onClose } = useDisclosure({
    isOpen: segment !== "(slot)" && segment !== null,
  });

  // Track if we can go back to the programs details page
  const canGoBack = useRef(false);

  // Check if we can go back to the programs details page
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      // Check if there's a previous page in history and if it's likely the programs details page
      const hasHistory = window.history.length > 1;
      const currentPath = window.location.pathname;

      // If we have history and we're in a modal route, we likely came from the programs details page
      canGoBack.current =
        hasHistory && currentPath.includes(`/programs/${program.slug}/`);
    }
  }, [isOpen, program.slug]);

  const handleClose = () => {
    onClose();

    // If we can go back and there's history, use back navigation
    // Otherwise, navigate to the programs details page
    if (
      canGoBack.current &&
      typeof window !== "undefined" &&
      window.history.length > 1
    ) {
      router.back();
    } else {
      router.push(`/programs/${program.slug}`);
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
