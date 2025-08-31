"use client";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
} from "@sovoli/ui/components/drawer";
import { useRouter } from "next/navigation";

interface NavigationDrawerProps {
  parentUrl: string;
  children: React.ReactNode;
}

export function NavigationDrawer({
  parentUrl,
  children,
}: NavigationDrawerProps) {
  const router = useRouter();
  const { isOpen, onClose } = useDisclosure({
    defaultOpen: true,
  });

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={() => {
        onClose();
        // use 2 because the first page may be the browser's default page
        if (history.length <= 2) {
          router.push(parentUrl);
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
