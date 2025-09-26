"use client";

import { useState, useRef, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@sovoli/ui/components/dialog";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
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
  onSendMessage?: (message: string) => void;
  messages?: ChatMessage[];
  placeholder?: string;
  title?: string;
  isLoading?: boolean;
}

const QUICK_REPLIES = [
  "Hello!",
  "How can I help?",
  "Tell me more",
  "Thanks!",
  "I need assistance",
  "What are your hours?",
];

export function ChatDialog({
  isOpen,
  onOpenChange,
  onSendMessage,
  messages = [],
  placeholder = "Type your message...",
  title = "Chat Support",
  isLoading = false,
}: ChatDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  // Update local messages when prop changes
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setLocalMessages((prev) => [...prev, newMessage]);
    onSendMessage?.(inputValue.trim());
    setInputValue("");
  };

  const handleQuickReply = (reply: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: reply,
      isUser: true,
      timestamp: new Date(),
    };

    setLocalMessages((prev) => [...prev, newMessage]);
    onSendMessage?.(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="full"
      placement="center"
      backdrop="opaque"
      classNames={{
        base: "max-h-[90vh]",
        body: "p-0",
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

            <ModalBody className="flex flex-col h-[500px] p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {localMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-default-500">
                    <MessageCircleIcon className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-sm">Start a conversation</p>
                    <p className="text-xs">
                      Send a message or use one of the quick replies below
                    </p>
                  </div>
                ) : (
                  <>
                    {localMessages.map((message) => (
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

              {/* Quick Reply Buttons */}
              {localMessages.length === 0 && (
                <div className="px-4 py-2 border-t border-divider">
                  <p className="text-xs text-default-500 mb-2">
                    Quick replies:
                  </p>
                  <div className="flex flex-wrap gap-2">
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
              <div className="p-4 border-t border-divider">
                <div className="flex gap-2">
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
              </div>
            </ModalBody>
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
