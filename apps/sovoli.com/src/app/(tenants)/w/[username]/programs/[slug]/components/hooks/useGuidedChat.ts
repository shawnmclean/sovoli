import posthog from "posthog-js";
import { useState } from "react";

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
}

interface InputField {
  name: "phone" | "firstName" | "lastName";
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
    placeholder: "Enter your phone number",
    type: "tel",
    validation: {
      minLength: 10,
    },
    message: "📱 What's your phone number so we can reach you?",
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
];

export function useGuidedChat({
  program,
  cycle,
}: {
  program?: string;
  cycle?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "system",
      message: `👋 Welcome! Let's get you started with applying to ${program ?? "Primary"} for ${cycle ?? "2024-2025"}.`,
      timestamp: Date.now(),
    },
    {
      id: "phone-question",
      sender: "system",
      message: INPUT_FIELDS[0]?.message ?? "",
      timestamp: Date.now(),
    },
  ]);

  const [chatData, setChatData] = useState<ChatData>({});
  const [currentStep, setCurrentStep] = useState(0);

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
      posthog.capture("Lead", {
        program,
        cycle,
        source: "guided_chat",
        $set: { phone },
      });

      // Move to next step
      setCurrentStep(1);
      addMessage("system", INPUT_FIELDS[1]?.message ?? "");
    } else if (currentField.name === "firstName") {
      const firstName = inputValue.trim();
      setChatData((prev) => ({ ...prev, firstName }));

      posthog.setPersonProperties({
        first_name: firstName,
        name: firstName,
      });

      // Move to next step
      setCurrentStep(2);
      addMessage("system", INPUT_FIELDS[2]?.message ?? "");
    } else {
      const lastName = inputValue.trim();
      setChatData((prev) => ({ ...prev, lastName }));

      posthog.setPersonProperties({
        last_name: lastName,
        name: `${chatData.firstName} ${lastName}`,
      });

      addMessage(
        "system",
        "🎉 All set! We'll be in touch soon. If you have any questions, please reach out to us on WhatsApp.",
      );
    }
  };

  const getCurrentField = () => {
    return INPUT_FIELDS[currentStep];
  };

  const isDone = messages.some(
    (msg) => msg.sender === "system" && msg.message.includes("🎉 All set!"),
  );

  return {
    messages,
    chatData,
    handleSendMessage,
    getCurrentField,
    isDone,
  };
}
