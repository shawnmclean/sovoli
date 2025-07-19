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
  childCount?: number;
  children: number[];
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

  const [chatData, setChatData] = useState<ChatData>({
    childCount: 1,
    children: [2],
  });

  const [currentInput, setCurrentInput] = useState("592");
  const [inputType, setInputType] = useState<
    "phone" | "childCount" | "childAge"
  >("phone");
  const [currentChildIndex, setCurrentChildIndex] = useState(0);

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

        // Add system response
        addMessage("system", "👶 How many children are you enrolling?");
        setInputType("childCount");
        setCurrentInput("1");
      }
    } else if (inputType === "childCount") {
      const count = parseInt(currentInput);
      if (count >= 1 && count <= 10) {
        setChatData((prev) => ({
          ...prev,
          childCount: count,
          children: Array<number>(count).fill(2),
        }));
        setCurrentChildIndex(0);

        // Add system response for first child
        addMessage("system", `✅ Got it. How old is child 1?`);
        setInputType("childAge");
        setCurrentInput("2");
      }
    } else {
      const age = parseInt(currentInput);
      if (age >= 1 && age <= 18) {
        const updatedChildren = [...chatData.children];
        updatedChildren[currentChildIndex] = age;
        setChatData((prev) => ({ ...prev, children: updatedChildren }));

        if (currentChildIndex + 1 < Number(chatData.childCount ?? 0)) {
          // Move to next child
          setCurrentChildIndex(currentChildIndex + 1);
          addMessage("system", `How old is child ${currentChildIndex + 2}?`);
        } else {
          // All children processed, show final message
          const childAges = updatedChildren
            .filter((age) => age && age > 0)
            .join(", ");
          const childText =
            (chatData.childCount ?? 1) === 1 ? "child" : "children";
          const finalMessage = `I'm applying for "${program ?? "Primary"}" for "${cycle ?? "2024-2025"}". I have ${chatData.childCount} ${childText} ages ${childAges}. Please let me know next steps.`;

          addMessage(
            "system",
            "🎉 All set! Tap below to send this to our enrollment assistant on WhatsApp.",
          );
          addMessage("user", finalMessage);
        }
        setCurrentInput("");
      }
    }
  };

  const getCurrentPlaceholder = () => {
    switch (inputType) {
      case "phone":
        return "Enter your WhatsApp number";
      case "childCount":
        return "Number of children";
      case "childAge":
        return `Enter age for child ${currentChildIndex + 1}`;
      default:
        return "";
    }
  };

  const isInputValid = () => {
    if (!currentInput.trim()) return false;
    switch (inputType) {
      case "phone":
        return currentInput.trim().length >= 10;
      case "childCount": {
        const count = parseInt(currentInput);
        return count >= 1 && count <= 10;
      }
      case "childAge": {
        const age = parseInt(currentInput);
        return age >= 1 && age <= 18;
      }
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
