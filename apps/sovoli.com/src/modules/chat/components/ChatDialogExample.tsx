"use client";

import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import { ChatDialog } from "./ChatDialog";
import { MessageCircleIcon } from "lucide-react";

export function ChatDialogExample() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    defaultOpen: true,
  });

  return (
    <div className="p-4">
      <Button
        color="primary"
        startContent={<MessageCircleIcon className="w-4 h-4" />}
        onPress={onOpen}
      >
        Open AI Chat
      </Button>

      <ChatDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placeholder="Ask me anything..."
      />
    </div>
  );
}
