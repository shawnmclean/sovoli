"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { useChat } from "@ai-sdk/react";
import { SendIcon, MessageCircleIcon } from "lucide-react";
import { Avatar } from "@sovoli/ui/components/avatar";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { Badge } from "@sovoli/ui/components/badge";

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  placeholder?: string;
  title?: string;
}

const QUICK_REPLIES = [
  "Your cost?",
  "Payment options?",
  "Location?",
  "What are your hours?",
  "Can I schedule a tour?",
];

export function ChatDialog({
  isOpen,
  onOpenChange,
  placeholder = "Type your message...",
}: ChatDialogProps) {
  const { messages: aiMessages, sendMessage } = useChat();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use a small delay to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [aiMessages.length]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    void (async () => {
      try {
        setIsLoading(true);
        await sendMessage({ text: inputValue.trim() });
        setInputValue("");
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const handleQuickReply = (reply: string) => {
    void (async () => {
      try {
        setIsLoading(true);
        await sendMessage({ text: reply });
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Drawer
      scrollBehavior="inside"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      size="full"
      placement="bottom"
      backdrop="opaque"
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
        {(onClose) => (
          <>
            <DrawerHeader showBackButton onBackPress={onClose}>
              <div className="flex items-center gap-3 ml-2">
                <Badge
                  color="success"
                  content=""
                  placement="bottom-right"
                  shape="circle"
                >
                  <Avatar src="/logo.svg" name="Sovoli" radius="full" />
                </Badge>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    Sovoli
                  </span>
                  <span className="text-xs text-default-500">AI Assistant</span>
                </div>
              </div>
            </DrawerHeader>

            <DrawerBody className="p-0 h-[calc(100vh-200px)]">
              <div className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto p-4 flex flex-col justify-end">
                  <div className="space-y-4">
                    {aiMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center text-default-500">
                        <MessageCircleIcon className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-sm">Start a conversation</p>
                        <p className="text-xs">
                          Send a message or use one of the quick replies below
                        </p>
                      </div>
                    ) : (
                      <>
                        {aiMessages.map((message) => (
                          <MessageBubble
                            key={message.id}
                            message={{
                              id: message.id,
                              text: message.parts
                                .map((part) => {
                                  switch (part.type) {
                                    case "text":
                                      return part.text;
                                    default:
                                      return "";
                                  }
                                })
                                .join(""),
                              isUser: message.role === "user",
                              timestamp: new Date(),
                            }}
                          />
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-default-100 text-default-foreground rounded-2xl rounded-bl-md px-3 py-2 max-w-[80%]">
                              <div className="flex items-center gap-2">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce" />
                                  <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                                  <div className="w-2 h-2 bg-default-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                </div>
                                <span className="text-sm text-default-500">
                                  AI is typing...
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
            </DrawerBody>

            <DrawerFooter className="flex flex-col gap-2 p-4 border-t border-divider">
              {/* Quick Reply Buttons */}
              {aiMessages.length === 0 && (
                <div className="w-full">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {QUICK_REPLIES.map((reply) => (
                      <Button
                        key={reply}
                        size="sm"
                        variant="bordered"
                        className="text-xs"
                        onPress={() => handleQuickReply(reply)}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="flex w-full items-center gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isLoading ? "AI is thinking..." : placeholder}
                  className="flex-1"
                  variant="bordered"
                  size="lg"
                  isDisabled={isLoading}
                />
                <Button
                  isIconOnly
                  color="primary"
                  size="lg"
                  onPress={handleSendMessage}
                  isDisabled={!inputValue.trim() || isLoading}
                  isLoading={isLoading}
                >
                  <SendIcon className="w-4 h-4" />
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
          message.isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-default-100 text-default-foreground rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        <p
          className={`text-xs mt-1 ${
            message.isUser ? "text-primary-foreground/70" : "text-default-500"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
