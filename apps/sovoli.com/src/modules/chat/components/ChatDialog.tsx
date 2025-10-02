"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { useChat } from "@ai-sdk/react";
import { SendIcon } from "lucide-react";
import { Avatar } from "@sovoli/ui/components/avatar";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { Badge } from "@sovoli/ui/components/badge";
import Image from "next/image";
import { ConversationForm } from "./ConversationForm";
import type {
  ConversationFormConfig,
  FormResponse,
} from "../types/conversation-form";

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
  conversationConfig?: ConversationFormConfig;
  showConversationForm?: boolean;
}

const QUICK_REPLIES = [
  "Your cost?",
  "Payment options?",
  "Location?",
  "What are your hours?",
  "Can I schedule a tour?",
];

type DialogMode = "conversation" | "chat";

export function ChatDialog({
  isOpen,
  onOpenChange,
  placeholder = "Type your message...",
  conversationConfig,
  showConversationForm = false,
}: ChatDialogProps) {
  const { messages: aiMessages, sendMessage } = useChat();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<DialogMode>(
    showConversationForm && conversationConfig ? "conversation" : "chat",
  );
  const [formResponses, setFormResponses] = useState<FormResponse>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset mode when dialog opens with conversation form
  useEffect(() => {
    if (isOpen && showConversationForm && conversationConfig) {
      setMode("conversation");
      setFormResponses({});
    }
  }, [isOpen, showConversationForm, conversationConfig]);

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

  const handleFormComplete = (responses: FormResponse) => {
    setFormResponses(responses);
    setMode("chat");
    // You can process the form responses here and potentially send them to the AI
    console.log("Form completed with responses:", responses);
  };

  const handleFormCancel = () => {
    onOpenChange(false);
  };

  const handleBackToForm = () => {
    setMode("conversation");
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
                  <span className="text-xs text-default-500">
                    {mode === "conversation" ? "Questionnaire" : "AI Assistant"}
                  </span>
                </div>
                {mode === "chat" &&
                  Object.keys(formResponses).length > 0 &&
                  conversationConfig && (
                    <Button
                      size="sm"
                      variant="light"
                      onPress={handleBackToForm}
                      className="ml-auto"
                    >
                      Back to Form
                    </Button>
                  )}
              </div>
            </DrawerHeader>

            <DrawerBody className="p-0 h-[calc(100vh-200px)] relative overflow-hidden">
              {/* Subtle Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-default-50/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />

              <div className="flex flex-col h-full relative z-10">
                {mode === "conversation" && conversationConfig ? (
                  <ConversationForm
                    config={{
                      ...conversationConfig,
                      onComplete: handleFormComplete,
                      onCancel: handleFormCancel,
                    }}
                  />
                ) : (
                  <div className="flex-grow overflow-y-auto p-4 flex flex-col justify-end">
                    <div className="space-y-4">
                      {/* Show form responses summary if available */}
                      {Object.keys(formResponses).length > 0 && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-medium text-primary mb-2">
                            Your Information:
                          </h4>
                          <div className="space-y-1">
                            {Object.entries(formResponses).map(
                              ([key, value]) => (
                                <p
                                  key={key}
                                  className="text-xs text-default-600"
                                >
                                  <span className="font-medium">{key}:</span>{" "}
                                  {String(value)}
                                </p>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {aiMessages.length === 0 ? (
                        <WelcomeScreen />
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
                )}
              </div>
            </DrawerBody>

            {mode === "chat" && (
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
            )}
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {/* Content */}
      <div className="flex flex-col items-center space-y-6">
        {/* Sovoli Logo */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 flex items-center justify-center shadow-lg">
            <Image
              src="/logo.svg"
              alt="Sovoli Logo"
              className="w-12 h-12"
              width={48}
              height={48}
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sovoli</h1>
        </div>

        {/* Welcome Text */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">
            Hey, I'm your AI assistant!
          </h2>
          <p className="text-sm text-default-600 max-w-xs leading-relaxed">
            I'm here to help you with any questions about our programs,
            admissions, or anything else you'd like to know.
          </p>
        </div>
      </div>
    </div>
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
