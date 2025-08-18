import { useState } from "react";
import {
  trackProgramAnalytics,
  setPersonProperties,
} from "../../lib/programAnalytics";
import type { Program, ProgramCycle } from "~/modules/academics/types";

interface ChatMessage {
  id: string;
  sender: "system" | "user";
  message: string;
  timestamp: number;
}

interface ChatData {
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  question?: string;
}

interface InputField {
  name: "phone" | "firstName" | "lastName" | "question";
  placeholder: string;
  type: "tel" | "text";
  validation: {
    minLength: number;
    pattern?: RegExp;
  };
  message: string;
}

const INPUT_FIELDS: InputField[] = [
  {
    name: "phone",
    placeholder: "Enter your WhatsApp number",
    type: "tel",
    validation: {
      minLength: 10,
    },
    message: "📱 What's your WhatsApp number so we can reach you?",
  },
  {
    name: "firstName",
    placeholder: "Enter your first name",
    type: "text",
    validation: {
      minLength: 2,
    },
    message: "👤 What's your first name?",
  },
  {
    name: "lastName",
    placeholder: "Enter your last name",
    type: "text",
    validation: {
      minLength: 2,
    },
    message: "👤 What's your last name?",
  },
  {
    name: "question",
    placeholder: "Type your question here...",
    type: "text",
    validation: {
      minLength: 5,
    },
    message: "❓ What would you like to know?",
  },
];

export function useGuidedChat({
  program,
  cycle,
}: {
  program?: Program;
  cycle?: ProgramCycle;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "system",
      message: "👋 Welcome! Let's get you started.",
      timestamp: Date.now(),
    },
    {
      id: "phone-question",
      sender: "system",
      message:
        INPUT_FIELDS[0]?.message ??
        "📱 What's your WhatsApp number so we can reach you?",
      timestamp: Date.now(),
    },
  ]);

  const [chatData, setChatData] = useState<ChatData>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showChoiceButtons, setShowChoiceButtons] = useState(false);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);

  const addMessage = (sender: "system" | "user", message: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender,
      message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = (inputValue: string) => {
    if (!inputValue.trim()) return;

    const currentField = INPUT_FIELDS[currentStep];
    if (!currentField) return;

    // Add user message
    addMessage("user", inputValue);

    // Process based on current step
    if (currentField.name === "phone") {
      const phone = inputValue.trim();
      setChatData((prev) => ({ ...prev, phoneNumber: phone }));

      setPersonProperties({
        phone: phone,
      });

      // Move to next step
      setCurrentStep(1);
      addMessage("system", INPUT_FIELDS[1]?.message ?? "");
    } else if (currentField.name === "firstName") {
      const firstName = inputValue.trim();
      setChatData((prev) => ({ ...prev, firstName }));

      setPersonProperties({
        first_name: firstName,
        name: firstName,
      });

      // Move to next step
      setCurrentStep(2);
      addMessage("system", INPUT_FIELDS[2]?.message ?? "");
    } else if (currentField.name === "lastName") {
      const lastName = inputValue.trim();
      setChatData((prev) => ({ ...prev, lastName }));

      setPersonProperties({
        last_name: lastName,
        name: `${chatData.firstName} ${lastName}`,
      });

      addMessage("system", "🎉 Which of the following best describes you?");

      setShowChoiceButtons(true);
    } else {
      const question = inputValue.trim();
      setChatData((prev) => ({ ...prev, question }));

      if (program) {
        trackProgramAnalytics("Contact", program, cycle);
      }

      addMessage(
        "system",
        "🎉 Perfect! Tap below to send this to our enrollment assistant on WhatsApp.",
      );

      setIsAskingQuestion(false);
    }
  };

  const handleAskQuestion = () => {
    setIsAskingQuestion(true);
    setShowChoiceButtons(false);
    setCurrentStep(3);
    addMessage("system", INPUT_FIELDS[3]?.message ?? "");
  };

  const getCurrentField = () => {
    return isAskingQuestion ? INPUT_FIELDS[3] : INPUT_FIELDS[currentStep];
  };

  const isDone = messages.some(
    (msg) => msg.sender === "system" && msg.message.includes("🎉 Perfect!"),
  );

  return {
    messages,
    chatData,
    handleSendMessage,
    getCurrentField,
    isDone,
    showChoiceButtons,
    handleAskQuestion,
  };
}
