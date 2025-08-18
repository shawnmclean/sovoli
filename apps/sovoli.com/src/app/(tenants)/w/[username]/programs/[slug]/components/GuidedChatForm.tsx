"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@sovoli/ui/components/input";
import { Button } from "@sovoli/ui/components/button";
import { SendIcon } from "lucide-react";
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
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import {
  trackProgramAnalytics,
  getProgramName,
  getCycleLabel,
  setPersonProperties,
} from "../lib/programAnalytics";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import { UsersIcon, GraduationCapIcon } from "lucide-react";

interface GuidedChatFormProps {
  whatsappNumber?: string;
  cycle?: ProgramCycle;
  program?: Program;
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
  const [currentInput, setCurrentInput] = useState("592");
  const previousIsOpenRef = useRef<boolean | undefined>(undefined);

  const {
    messages,
    chatData,
    handleSendMessage,
    getCurrentField,
    isDone,
    showChoiceButtons,
  } = useGuidedChat({
    cycle,
    program,
  });

  const currentField = getCurrentField();

  // Track chat open/close events
  useEffect(() => {
    // Skip on initial mount
    if (previousIsOpenRef.current === undefined) {
      previousIsOpenRef.current = isOpen;
      return;
    }

    // Only fire events when the state actually changes
    if (previousIsOpenRef.current !== isOpen) {
      if (isOpen && program) {
        trackProgramAnalytics("ChatOpened", program, cycle);
      } else if (program) {
        trackProgramAnalytics("ChatClosed", program, cycle);
      }
      previousIsOpenRef.current = isOpen;
    }
  }, [isOpen, cycle, program]);

  // Helper to generate the WhatsApp preview message
  const previewMessage = () => {
    const programName = program ? getProgramName(program) : "Primary";
    const cycleLabel = cycle ? getCycleLabel(cycle) : "2024-2025";
    const baseMessage = `Hi, I'm ${chatData.firstName} ${chatData.lastName}. I'm interested in applying for "${programName}" for "${cycleLabel}".`;

    if (chatData.question) {
      return `${baseMessage} I have a question: ${chatData.question}.`;
    }

    return `${baseMessage}`;
  };

  // Custom send message handler that maintains focus
  const handleSendMessageWithFocus = () => {
    if (!currentField || !isInputValid()) return;

    handleSendMessage(currentInput);
    setCurrentInput("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Validation function based on current field
  const isInputValid = () => {
    if (!currentInput.trim() || !currentField) return false;

    const trimmedInput = currentInput.trim();
    return trimmedInput.length >= currentField.validation.minLength;
  };

  // Render the correct input based on current field
  const renderInput = () => {
    if (!currentField) return null;

    return (
      <Input
        ref={inputRef}
        fullWidth
        autoFocus
        type={currentField.type}
        size="lg"
        variant="bordered"
        placeholder={currentField.placeholder}
        value={currentInput}
        onValueChange={setCurrentInput}
        onKeyDown={(e) => {
          if (e.key === "Enter" && isInputValid()) {
            handleSendMessageWithFocus();
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
              {!isDone && currentField && !showChoiceButtons && (
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-grow">{renderInput()}</div>
                  <Button
                    color="primary"
                    onPress={handleSendMessageWithFocus}
                    isIconOnly
                    isDisabled={!isInputValid()}
                    size="lg"
                  >
                    <SendIcon size={20} />
                  </Button>
                </div>
              )}

              {/* Choice buttons */}
              {showChoiceButtons && (
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    color="primary"
                    as={WhatsAppLink}
                    phoneNumber={whatsappNumber}
                    message={previewMessage()}
                    fullWidth
                    onPress={() => {
                      if (program) {
                        trackProgramAnalytics("Lead", program, cycle, {
                          $set: {
                            role:
                              program.audience === "student"
                                ? "student"
                                : "parent",
                          },
                        });
                      }
                      onClose();
                    }}
                    startContent={<UsersIcon size={16} />}
                  >
                    {program?.audience === "student"
                      ? "Student"
                      : "I'm a Parent / Guardian"}
                  </Button>
                  <Button
                    color="primary"
                    variant="flat"
                    as={WhatsAppLink}
                    phoneNumber={whatsappNumber}
                    message="Hi! I'm seeking a job!"
                    fullWidth
                    startContent={<GraduationCapIcon size={16} />}
                    onPress={() => {
                      setPersonProperties({
                        role: "job_seeker",
                      });
                      onClose();
                    }}
                  >
                    I'm seeking a job
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
                    program: program ? getProgramName(program) : undefined,
                    cycle: cycle ? getCycleLabel(cycle) : undefined,
                  }}
                  fullWidth
                  startContent={<SiWhatsapp size={16} />}
                  className={gradientBorderButton()}
                  onPress={() => {
                    if (program) {
                      trackProgramAnalytics("Contact", program, cycle);
                    }
                    onClose();
                  }}
                >
                  Start WhatsApp Chat
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
