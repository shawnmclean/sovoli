"use client";

import { useState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import { useChat } from "@ai-sdk/react";
import { ChatDialog } from "./ChatDialog";
import type { ChatMessage } from "./ChatDialog";
import { MessageCircleIcon } from "lucide-react";

export function ChatDialogExample() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { messages: aiMessages, sendMessage } = useChat();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Convert AI SDK messages to our ChatMessage format
  useEffect(() => {
    const convertedMessages: ChatMessage[] = aiMessages.map((msg) => ({
      id: msg.id,
      text: msg.parts
        .map((part) => {
          switch (part.type) {
            case "text":
              return part.text;
            default:
              return "";
          }
        })
        .join(""),
      isUser: msg.role === "user",
      timestamp: new Date(),
    }));

    setChatMessages(convertedMessages);
  }, [aiMessages]);

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      await sendMessage({ text: message });
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Sorry, there was an error processing your message. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button
        color="primary"
        startContent={<MessageCircleIcon className="w-4 h-4" />}
        onPress={onOpen}
        isLoading={isLoading}
      >
        {isLoading ? "AI is thinking..." : "Open AI Chat"}
      </Button>

      <ChatDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSendMessage={handleSendMessage}
        messages={chatMessages}
        title="AI Assistant"
        placeholder="Ask me anything..."
        isLoading={isLoading}
      />
    </div>
  );
}
