"use client";

import { AgeChatInput } from "./AgeChatInput";
import { LocationInput } from "./LocationInput";
import type { ChatInputType } from "../../types";

export interface ChatInputProps {
  inputType: ChatInputType;
  onSubmit: (value: string) => void;
}

export function ChatInput({ inputType, onSubmit }: ChatInputProps) {
  switch (inputType) {
    case "age":
      return <AgeChatInput onSubmit={onSubmit} />;
    case "location":
      return <LocationInput onSubmit={onSubmit} />;
    default:
      return null;
  }
}
