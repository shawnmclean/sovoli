"use client";

import { Drawer } from "@sovoli/ui/components/drawer";
import { ChatDialog } from "~/modules/chat/components/ChatDialog";
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
      <ChatDialog />
    </Drawer>
  );
}
