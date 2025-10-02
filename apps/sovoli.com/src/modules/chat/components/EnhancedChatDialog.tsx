"use client";

import React, { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Badge } from "@sovoli/ui/components/badge";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import Image from "next/image";
import { ConversationForm } from "./ConversationForm";
import { ChatDialog } from "./ChatDialog";
import {
  ConversationFormConfig,
  FormResponse,
} from "../types/conversation-form";

export interface EnhancedChatDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  placeholder?: string;
  title?: string;
  conversationConfig?: ConversationFormConfig;
  showConversationForm?: boolean;
}

type DialogMode = "conversation" | "chat";

export function EnhancedChatDialog({
  isOpen,
  onOpenChange,
  placeholder = "Type your message...",
  conversationConfig,
  showConversationForm = false,
}: EnhancedChatDialogProps) {
  const [mode, setMode] = useState<DialogMode>(
    showConversationForm ? "conversation" : "chat",
  );
  const [formResponses, setFormResponses] = useState<FormResponse>({});

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

  const handleChatComplete = () => {
    // Reset form when chat is complete
    setFormResponses({});
    setMode("conversation");
  };

  if (!conversationConfig) {
    // Fallback to regular chat dialog if no conversation config provided
    return (
      <ChatDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placeholder={placeholder}
      />
    );
  }

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
                  formResponses &&
                  Object.keys(formResponses).length > 0 && (
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
                {mode === "conversation" ? (
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
                      {formResponses &&
                        Object.keys(formResponses).length > 0 && (
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

                      {/* Chat content would go here - you can integrate with your existing chat logic */}
                      <div className="text-center text-default-500">
                        <p>Chat functionality will be integrated here</p>
                        <Button
                          size="sm"
                          variant="bordered"
                          onPress={handleChatComplete}
                          className="mt-2"
                        >
                          Complete Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
