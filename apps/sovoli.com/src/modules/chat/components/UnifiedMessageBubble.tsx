"use client";

import type { UnifiedMessage } from "../types/message";

interface UnifiedMessageBubbleProps {
  message: UnifiedMessage;
}

export function UnifiedMessageBubble({ message }: UnifiedMessageBubbleProps) {
  const isUser = message.type === "user_response";
  const isSystem =
    message.type === "question" || message.type === "system_response";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : isSystem
              ? "bg-default-100 text-default-foreground rounded-bl-md"
              : "bg-default-200 text-default-foreground rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isUser ? "text-primary-foreground/70" : "text-default-500"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
