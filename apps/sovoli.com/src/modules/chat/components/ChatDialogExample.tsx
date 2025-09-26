"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import { ChatDialog } from "./ChatDialog";
import type { ChatMessage } from "./ChatDialog";
import { MessageCircleIcon } from "lucide-react";

export function ChatDialogExample() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = (message: string) => {
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        text: `Thanks for your message: "${message}". This is a simulated response.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="p-4">
      <Button
        color="primary"
        startContent={<MessageCircleIcon className="w-4 h-4" />}
        onPress={onOpen}
      >
        Open Chat
      </Button>

      <ChatDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSendMessage={handleSendMessage}
        messages={messages}
        title="Customer Support"
        placeholder="Type your question here..."
      />
    </div>
  );
}
