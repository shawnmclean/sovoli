"use client";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import { Drawer } from "@sovoli/ui/components/drawer";
import {
  useRouter,
  useSelectedLayoutSegment,
  usePathname,
} from "next/navigation";
import { useEffect, useRef } from "react";

// Simple hook to track the previous path
function usePreviousPath() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    previousPath.current = pathname;
  }, [pathname]);

  return previousPath.current;
}

// Helper to check if a path is internal to the app
function isInternalPath(path: string | null): boolean {
  if (!path) return false;

  // Check if it's a relative path starting with /
  if (path.startsWith("/")) return true;

  // Check if it's an absolute URL on the same origin
  try {
    const url = new URL(path, window.location.origin);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

interface NavigationDrawerProps {
  children: React.ReactNode;
  fallbackPath?: string;
  slotName?: string;
}

export function NavigationDrawer({
  children,
  fallbackPath = "/",
  slotName = "modals",
}: NavigationDrawerProps) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment(slotName);
  const previousPath = usePreviousPath();
  const { isOpen, onClose } = useDisclosure({
    isOpen: segment !== "(slot)" && segment !== null,
  });

  const handleClose = () => {
    onClose();

    // Only use back navigation if the previous path is internal to our app
    // Otherwise, navigate to the fallback path
    if (isInternalPath(previousPath)) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  };

  return (
    <Drawer
      scrollBehavior="inside"
      isOpen={isOpen}
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
      {children}
    </Drawer>
  );
}
