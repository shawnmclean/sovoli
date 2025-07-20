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
      message: "👋 Welcome! Let's get you started.",
      timestamp: Date.now(),
    },
    {
      id: "phone-question",
      sender: "system",
      message: "📱 What's your WhatsApp number so we can reach you?",
      timestamp: Date.now(),
    },
  ]);

  const [chatData, setChatData] = useState<ChatData>({});

  const [currentInput, setCurrentInput] = useState("592");
  const [inputType, setInputType] = useState<
    "phone" | "firstName" | "lastName"
  >("phone");

  const addMessage = (sender: "system" | "user", message: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender,
      message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    // Add user message
    addMessage("user", currentInput);

    // Process based on input type
    if (inputType === "phone") {
      const phone = currentInput.trim();
      if (phone.length >= 10) {
        setChatData((prev) => ({ ...prev, phoneNumber: phone }));
        posthog.capture("Lead", {
          program,
          cycle,
          source: "guided_chat",
          $set: { phone },
        });

        // Add system response for first name
        addMessage("system", "👤 What's your first name?");
        setInputType("firstName");
        setCurrentInput("");
      }
    } else if (inputType === "firstName") {
      const firstName = currentInput.trim();
      if (firstName.length >= 2) {
        setChatData((prev) => ({ ...prev, firstName }));

        posthog.setPersonProperties({
          first_name: firstName,
          name: firstName,
        });

        // Add system response for last name
        addMessage("system", "👤 What's your last name?");
        setInputType("lastName");
        setCurrentInput("");
      }
    } else {
      const lastName = currentInput.trim();
      if (lastName.length >= 2) {
        setChatData((prev) => ({ ...prev, lastName }));

        posthog.setPersonProperties({
          last_name: lastName,
          name: `${chatData.firstName} ${lastName}`,
        });

        // Show final message
        const finalMessage = `Hi, I'm ${chatData.firstName} ${lastName}. I'm interested in applying for "${program ?? "Primary"}" for "${cycle ?? "2024-2025"}". Please let me know next steps.`;

        addMessage(
          "system",
          "🎉 All set! Tap below to send this to our enrollment assistant on WhatsApp.",
        );
        addMessage("user", finalMessage);
        setCurrentInput("");
      }
    }
  };

  const getCurrentPlaceholder = () => {
    switch (inputType) {
      case "phone":
        return "Enter your WhatsApp number";
      case "firstName":
        return "Enter your first name";
      case "lastName":
        return "Enter your last name";
      default:
        return "";
    }
  };

  const isInputValid = () => {
    if (!currentInput.trim()) return false;
    switch (inputType) {
      case "phone":
        return currentInput.trim().length >= 10;
      case "firstName":
        return currentInput.trim().length >= 2;
      case "lastName":
        return currentInput.trim().length >= 2;
      default:
        return false;
    }
  };

  const isDone = messages.some(
    (msg) => msg.sender === "system" && msg.message.includes("🎉 All set!"),
  );

  return {
    messages,
    currentInput,
    setCurrentInput,
    inputType,
    chatData,
    handleSendMessage,
    getCurrentPlaceholder,
    isInputValid,
    isDone,
  };
}
