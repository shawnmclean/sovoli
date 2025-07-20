"use client";

import React, { useEffect } from "react";
import { Input } from "@sovoli/ui/components/input";
import { Button } from "@sovoli/ui/components/button";
import { MessageSquareIcon, SendIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { gradientBorderButton } from "~/components/GradientBorderButton";
import { ChatMessage } from "./ChatMessage";
import { useGuidedChat } from "./hooks/useGuidedChat";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@sovoli/ui/components/dialog";
import posthog from "posthog-js";

interface GuidedChatFormProps {
  whatsappNumber?: string;
  cycle?: string;
  program?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuidedChatForm({
  whatsappNumber,
  cycle,
  program,
  isOpen,
  onOpenChange,
}: GuidedChatFormProps) {
  const {
    messages,
    currentInput,
    setCurrentInput,
    inputType,
    chatData,
    handleSendMessage,
    getCurrentPlaceholder,
    isInputValid,
    isDone,
  } = useGuidedChat({ cycle, program });

  // Track chat open/close events
  useEffect(() => {
    if (isOpen) {
      posthog.capture("ChatOpened", {
        cycle,
        program,
      });
    } else {
      // Track when chat is closed
      posthog.capture("ChatClosed", {
        cycle,
        program,
      });
    }
  }, [isOpen, cycle, program]);

  // Helper to generate the WhatsApp preview message
  const previewMessage = () => {
    return `Hi, I'm ${chatData.firstName} ${chatData.lastName}. I'm interested in applying for "${program ?? "Primary"}" for "${cycle ?? "2024-2025"}". Please let me know next steps.`;
  };

  // Render the correct input based on inputType
  const renderInput = () => {
    return (
      <Input
        fullWidth
        autoFocus
        type={inputType === "phone" ? "tel" : "text"}
        size="lg"
        variant="bordered"
        placeholder={getCurrentPlaceholder()}
        value={currentInput}
        onValueChange={setCurrentInput}
        onKeyDown={(e) => {
          if (e.key === "Enter" && isInputValid()) {
            handleSendMessage();
          }
        }}
      />
    );
  };

  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      size="full"
      onOpenChange={onOpenChange}
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
        {(onClose) => (
          <>
            <ModalHeader>Enrollment Assistant</ModalHeader>
            <ModalBody className="p-0 h-[calc(100vh-200px)]">
              <div className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto p-4 flex flex-col justify-end">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <ChatMessage
                        key={msg.id}
                        sender={msg.sender}
                        message={msg.message}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              {/* Chat input bar */}
              {!isDone && (
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-grow">{renderInput()}</div>
                  <Button
                    color="primary"
                    onPress={handleSendMessage}
                    isIconOnly
                    isDisabled={!isInputValid()}
                    size="lg"
                  >
                    <SendIcon size={20} />
                  </Button>
                </div>
              )}
              {isDone && (
                <Button
                  as={WhatsAppLink}
                  phoneNumber={whatsappNumber}
                  message={previewMessage()}
                  event="Contact"
                  eventProperties={{
                    program,
                    cycle,
                  }}
                  fullWidth
                  startContent={<MessageSquareIcon size={16} />}
                  className={gradientBorderButton()}
                  onPress={onClose}
                >
                  Send & Start Chat
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
