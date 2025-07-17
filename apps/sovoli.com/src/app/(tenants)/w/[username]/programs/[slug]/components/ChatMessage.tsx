interface ChatMessageProps {
  sender: "system" | "user";
  message: string;
}

export function ChatMessage({ sender, message }: ChatMessageProps) {
  const isSystem = sender === "system";

  return (
    <div className={`flex ${isSystem ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isSystem
            ? "bg-default-200 text-default-800 rounded-bl-md"
            : "bg-primary text-primary-foreground rounded-br-md"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}
