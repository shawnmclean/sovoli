"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { useChat } from "@ai-sdk/react";
import {
  EllipsisIcon,
  SendIcon,
  UsersIcon,
  ChevronDownIcon,
} from "lucide-react";
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
import { FamilyDrawer } from "./FamilyDrawer";
import type { FamilyMember } from "./FamilyDrawer";
import type { ChatMessage } from "../types";
import { AgeChatInput } from "./ChatInput/AgeChatInput";

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
  const { messages, sendMessage, setMessages, addToolResult, status } =
    useChat<ChatMessage>({
      // sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
      messages: [
        {
          id: crypto.randomUUID(),
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Hello! I'm here to help you with any questions you have.",
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "How old is your child?",
            },
            {
              type: "tool-getAge",
              state: "input-available",
              toolCallId: crypto.randomUUID(),
              input: {},
            },
          ],
        },
      ],
    });

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isFamilyDrawerOpen, setIsFamilyDrawerOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Check if there's an unanswered guided input
  const hasUnansweredInput = messages.some(
    (message) =>
      message.metadata?.isQuestion &&
      !message.metadata.answered &&
      message.role === "assistant",
  );

  // Check if user is at bottom of scroll
  const checkIfAtBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px threshold

      const shouldShowButton = !isAtBottom;
      setShowScrollButton(shouldShowButton);
    }
  };

  // Throttled scroll check to avoid excessive calls
  const throttledCheckIfAtBottom = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIfAtBottom, 100);
    };
  }, [])();

  // Handle scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Set up scroll and resize observers
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Initial check
    const timer = setTimeout(() => {
      checkIfAtBottom();
    }, 1000);

    // Set up ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(() => {
      console.log("Container resized, checking scroll position");
      checkIfAtBottom();
    });

    // Set up scroll listener
    const handleScroll = () => {
      throttledCheckIfAtBottom();
    };

    // Set up window resize listener
    const handleWindowResize = () => {
      console.log("Window resized, checking scroll position");
      checkIfAtBottom();
    };

    // Attach observers and listeners
    resizeObserver.observe(container);
    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleWindowResize);

    // Cleanup
    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [throttledCheckIfAtBottom]);

  // Check scroll position when messages change and auto-scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      checkIfAtBottom();
      // Auto-scroll to bottom when new messages arrive
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timer);
  }, [messages.length, status]);

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
            <DrawerHeader
              showBackButton
              onBackPress={onClose}
              startContent={
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
                      Sovoli AI
                    </span>
                    <span className="text-xs text-default-500">
                      Enrollment Advisor
                    </span>
                  </div>
                </div>
              }
              endContent={
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    onPress={() => setIsFamilyDrawerOpen(true)}
                    variant="light"
                  >
                    <UsersIcon className="w-4 h-4" />
                  </Button>
                  <Button isIconOnly onPress={onClose} variant="light">
                    <EllipsisIcon className="w-4 h-4" />
                  </Button>
                </div>
              }
            />

            <DrawerBody className="p-0 h-[calc(100vh-200px)] relative overflow-hidden">
              {/* Subtle Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-default-50/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />

              <div className="flex flex-col h-full relative z-10">
                <div
                  ref={messagesContainerRef}
                  className="flex-grow overflow-y-auto flex flex-col"
                >
                  <div className="space-y-4 p-4">
                    {/* Welcome Screen - Always visible at top */}
                    <WelcomeScreen />

                    {/* Messages */}
                    {messages.map((message) => (
                      <div key={message.id}>
                        {message.parts.map((part) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <MessageBubble
                                  isUser={message.role === "user"}
                                  timestamp={new Date()}
                                  text={part.text}
                                />
                              );
                            case "tool-getAge": {
                              const callId = part.toolCallId;

                              switch (part.state) {
                                case "input-streaming":
                                  return <div>Input streaming</div>;
                                case "input-available":
                                  return (
                                    <AgeChatInput
                                      onSubmit={(value) => {
                                        void (async () => {
                                          await addToolResult({
                                            tool: "getAge",
                                            toolCallId: callId,
                                            output: value,
                                          });

                                          setMessages((prev) => [
                                            ...prev,
                                            {
                                              role: "assistant",
                                              id: crypto.randomUUID(),
                                              parts: [
                                                {
                                                  type: "text",
                                                  text: "Age updated, do you want to add another child?",
                                                },
                                                {
                                                  type: "tool-getMoreChildren",
                                                  state: "input-available",
                                                  toolCallId:
                                                    crypto.randomUUID(),
                                                  input: {},
                                                },
                                              ],
                                            },
                                          ]);
                                        })();
                                      }}
                                    />
                                  );
                                case "output-available":
                                  return (
                                    <div>
                                      {part.output.years} years and{" "}
                                      {part.output.months} months
                                    </div>
                                  );
                              }
                              return <div>Calling tool getLocation</div>;
                            }
                            case "tool-getMoreChildren": {
                              const callId = part.toolCallId;

                              switch (part.state) {
                                case "input-streaming":
                                  return <div>Input streaming</div>;
                                case "input-available":
                                  return (
                                    <div>
                                      <Button
                                        onPress={() => {
                                          void (async () => {
                                            await addToolResult({
                                              tool: "getMoreChildren",
                                              toolCallId: callId,
                                              output: { choice: "add" },
                                            });

                                            setMessages((prev) => [
                                              ...prev,
                                              {
                                                id: crypto.randomUUID(),
                                                role: "assistant",
                                                parts: [
                                                  {
                                                    type: "text",
                                                    text: "How old is your child?",
                                                  },
                                                  {
                                                    type: "tool-getAge",
                                                    state: "input-available",
                                                    toolCallId:
                                                      crypto.randomUUID(),
                                                    input: {},
                                                  },
                                                ],
                                              },
                                            ]);
                                          })();
                                        }}
                                      >
                                        Add
                                      </Button>
                                      <Button
                                        onPress={() => {
                                          void (async () => {
                                            await addToolResult({
                                              tool: "getMoreChildren",
                                              toolCallId: callId,
                                              output: { choice: "done" },
                                            });

                                            void sendMessage({
                                              text: "What program fits my child the best?",
                                            });
                                          })();
                                        }}
                                      >
                                        Done
                                      </Button>
                                    </div>
                                  );
                                case "output-available":
                                  return <div>{part.output.choice}</div>;
                              }
                            }
                          }
                        })}
                      </div>
                    ))}
                    {(status === "submitted" || status === "streaming") && (
                      <div className="flex justify-start">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-default-100 rounded-bl-md">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <div
                              className="w-2 h-2 bg-primary rounded-full animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-primary rounded-full animate-pulse"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Scroll target for auto-scrolling */}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {showScrollButton && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Button
                      isIconOnly
                      variant="solid"
                      size="sm"
                      radius="full"
                      onPress={scrollToBottom}
                    >
                      <ChevronDownIcon className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </DrawerBody>

            <DrawerFooter className="flex flex-col gap-2 p-4 border-t border-divider">
              {/* Quick Reply Buttons */}
              {messages.length === 0 && (
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
                  placeholder={
                    hasUnansweredInput
                      ? "Please answer the question above first..."
                      : isLoading
                        ? "AI is thinking..."
                        : placeholder
                  }
                  className="flex-1"
                  variant="bordered"
                  size="lg"
                  isDisabled={isLoading || hasUnansweredInput}
                />
                <Button
                  isIconOnly
                  color="primary"
                  size="lg"
                  onPress={handleSendMessage}
                  isDisabled={
                    !inputValue.trim() || isLoading || hasUnansweredInput
                  }
                  isLoading={isLoading}
                >
                  <SendIcon className="w-4 h-4" />
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>

      {/* Family Drawer */}
      <FamilyDrawer
        isOpen={isFamilyDrawerOpen}
        onOpenChange={setIsFamilyDrawerOpen}
        familyMembers={familyMembers}
        onFamilyMembersChange={setFamilyMembers}
      />
    </Drawer>
  );
}

function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center text-center py-6 border-b border-divider/50">
      {/* Content */}
      <div className="flex flex-col items-center space-y-4">
        {/* Sovoli Logo */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 flex items-center justify-center shadow-lg">
            <Image
              src="/logo.svg"
              alt="Sovoli Logo"
              className="w-10 h-10"
              width={40}
              height={40}
            />
          </div>
          <h1 className="text-xl font-bold text-foreground">Sovoli</h1>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
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
  isUser: boolean;
  timestamp: Date;
  text: string;
}

function MessageBubble({ isUser, timestamp, text }: MessageBubbleProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-default-100 text-default-foreground rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        <p
          className={`text-xs mt-1 ${
            isUser ? "text-primary-foreground/70" : "text-default-500"
          }`}
        >
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
