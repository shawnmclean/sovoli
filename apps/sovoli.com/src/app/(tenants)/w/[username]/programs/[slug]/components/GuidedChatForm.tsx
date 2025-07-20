"use client";

import React, { useEffect, useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const isIOS =
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

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

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current && !isDone) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }

    posthog.capture(isOpen ? "ChatOpened" : "ChatClosed", {
      cycle,
      program,
    });
  }, [isOpen, isDone, cycle, program]);

  const handleSendMessageWithFocus = () => {
    handleSendMessage();

    // Delay to wait for DOM to update, then refocus input
    setTimeout(() => {
      const input = inputRef.current;
      if (input && !isDone) {
        input.focus();
        if (isIOS) {
          input.click(); // iOS needs this to show keyboard
          const length = input.value.length;
          input.setSelectionRange(length, length);
        }
      }
    }, 100); // iOS performs better with a small delay
  };

  const previewMessage = () =>
    `Hi, I'm ${chatData.firstName} ${chatData.lastName}. I'm interested in applying for "${program ?? "Primary"}" for "${cycle ?? "2024-2025"}". Please let me know next steps.`;

  const renderInput = () => (
    <Input
      ref={inputRef}
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
          handleSendMessageWithFocus();
        }
      }}
      autoComplete={inputType === "phone" ? "tel" : "off"}
      inputMode={inputType === "phone" ? "tel" : "text"}
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
    />
  );

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
            transition: { duration: 0.3 },
          },
          exit: {
            y: 100,
            opacity: 0,
            transition: { duration: 0.3 },
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
              {!isDone ? (
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-grow">{renderInput()}</div>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="rounded-full bg-primary text-white p-3"
                    disabled={!isInputValid()}
                    onClick={handleSendMessageWithFocus}
                  >
                    <SendIcon size={20} />
                  </button>
                </div>
              ) : (
                <Button
                  as={WhatsAppLink}
                  phoneNumber={whatsappNumber}
                  message={previewMessage()}
                  event="Contact"
                  eventProperties={{ program, cycle }}
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
