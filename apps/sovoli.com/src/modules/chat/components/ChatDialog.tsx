"use client";

import { useState, useRef, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@sovoli/ui/components/dialog";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { useChat } from "@ai-sdk/react";
import { SendIcon, MessageCircleIcon } from "lucide-react";

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
  title = "AI Assistant",
}: ChatDialogProps) {
  const { messages: aiMessages, sendMessage } = useChat();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    void (async () => {
      try {
        setIsLoading(true);
        await sendMessage({ text: inputValue.trim() });
        setInputValue("");
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
    })();
  };

  const handleQuickReply = (reply: string) => {
    void (async () => {
      try {
        setIsLoading(true);
        await sendMessage({ text: reply });
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
    })();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Modal
      scrollBehavior="inside"
      classNames={{
        wrapper: "h-(--visual-viewport-height)",
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="full"
      placement="center"
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
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-6 py-4 border-b border-divider">
              <div className="flex items-center gap-2">
                <MessageCircleIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">{title}</h2>
              </div>
            </ModalHeader>

            <ModalBody className="p-0 h-[calc(100vh-200px)]">
              <div className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto p-4 flex flex-col justify-end">
                  <div className="space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center text-default-500">
                        <MessageCircleIcon className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-sm">Start a conversation</p>
                        <p className="text-xs">
                          Send a message or use one of the quick replies below
                        </p>
                      </div>
                    ) : (
                      <>
                        {chatMessages.map((message) => (
                          <MessageBubble key={message.id} message={message} />
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
            </ModalBody>

            <ModalFooter className="flex flex-col gap-2 p-4 border-t border-divider">
              {/* Quick Reply Buttons */}
              {chatMessages.length === 0 && (
                <div className="w-full">
                  <p className="text-xs text-default-500 mb-3 text-center">
                    Quick replies:
                  </p>
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
                  autoFocus
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
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
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
