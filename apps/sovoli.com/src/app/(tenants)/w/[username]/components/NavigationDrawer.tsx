"use client";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import {
  useRouter,
  useSelectedLayoutSegment,
  usePathname,
} from "next/navigation";
import { useEffect, useRef } from "react";
import type { Program } from "~/modules/academics/types";

// Simple hook to track the previous path
function usePreviousPath() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    previousPath.current = pathname;
  }, [pathname]);

  return previousPath.current;
}

interface NavigationDrawerProps {
  program: Program;
  children: React.ReactNode;
}

export function NavigationDrawer({ program, children }: NavigationDrawerProps) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment("modals");
  const previousPath = usePreviousPath();
  const { isOpen, onClose } = useDisclosure({
    isOpen: segment !== "(slot)" && segment !== null,
  });

  const handleClose = () => {
    onClose();

    // Only use back navigation if we're confident the previous page is the program details page
    // Otherwise, navigate to the programs details page
    if (previousPath === `/programs/${program.slug}`) {
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
