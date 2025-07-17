import posthog from "posthog-js";
import { useState } from "react";

export function useGuidedChat({
  cycle,
  level,
}: {
  cycle?: string;
  level?: string;
}) {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("592");
  const [childCount, setChildCount] = useState(1);
  const [children, setChildren] = useState<number[]>([]);
  const [currentChildIndex, setCurrentChildIndex] = useState(0);

  const handleContinue = () => {
    if (step === 1) {
      posthog.setPersonProperties({
        phone: phoneNumber,
      });
      setStep(2);
    } else if (step === 2) {
      setChildren(Array(childCount).fill(undefined));
      setCurrentChildIndex(0);
      setStep(3);
    } else if (step === 3) {
      // Only proceed if we have a valid age for the current child
      if (children[currentChildIndex] && children[currentChildIndex] > 0) {
        if (currentChildIndex + 1 < childCount) {
          setCurrentChildIndex(currentChildIndex + 1);
        } else {
          setStep(4);
        }
      }
    }
  };

  const previewMessage = () => {
    const childAges = children.filter((age) => age && age > 0).join(", ");
    const childText = childCount === 1 ? "child" : "children";
    return `I'm applying for "${level ?? "Primary"}" for "${cycle ?? "2024-2025"}". I have ${childCount} ${childText} ages ${childAges}. Please let me know next steps.`;
  };

  return {
    step,
    phoneNumber,
    setPhoneNumber,
    children,
    childCount,
    setChildCount,
    updateChildAge: (index: number, age: number) => {
      const updated = [...children];
      updated[index] = age;
      setChildren(updated);
    },
    currentChildIndex,
    handleContinue,
    previewMessage,
    isDone: step === 4,
  };
}
