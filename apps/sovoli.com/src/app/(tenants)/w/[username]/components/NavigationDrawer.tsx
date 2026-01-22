"use client";
import { Drawer } from "@sovoli/ui/components/drawer";
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";

// Simple hook to track the previous path
function usePreviousPath() {
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const pathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // Store the current pathname value (from previous render) as previous
    // Then update the ref to the new pathname for next time
    const previous = pathnameRef.current;
    pathnameRef.current = pathname;

    startTransition(() => {
      setPreviousPath(previous);
    });
  }, [pathname]);

  // Return the previous pathname (which is the pathname from the previous render)
  return previousPath;
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
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use internal state to allow delaying navigation while animation completes
  const segmentShouldBeOpen = segment !== "(slot)" && segment !== null;
  const [isOpen, setIsOpen] = useState(segmentShouldBeOpen);

  // Sync isOpen with segment changes (only when opening)
  useEffect(() => {
    if (segmentShouldBeOpen) {
      startTransition(() => {
        setIsOpen(true);
      });
    }
  }, [segmentShouldBeOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    // Close drawer immediately to start exit animation
    setIsOpen(false);

    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Delay navigation until after exit animation (300ms) to allow FocusScope cleanup
    navigationTimeoutRef.current = setTimeout(() => {
      if (isInternalPath(previousPath)) {
        router.back();
      } else {
        router.push(fallbackPath);
      }
      navigationTimeoutRef.current = null;
    }, 300);
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
