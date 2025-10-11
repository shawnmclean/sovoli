"use client";

import { ChatDialogExample } from "~/modules/chat/components/ChatDialogExample";
import { Drawer } from "@sovoli/ui/components/drawer";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();

  return (
    <Drawer
      scrollBehavior="inside"
      isOpen={true}
      onClose={() => router.push("/")}
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
      <ChatDialogExample />
    </Drawer>
  );
}
