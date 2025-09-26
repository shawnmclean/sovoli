"use client";

import { ChatDialogExample } from "~/modules/chat/components/ChatDialogExample";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          Chat Dialog Test Page
        </h1>
        <p className="text-default-500 max-w-md">
          Click the button below to open the AI-powered chat dialog. The AI has
          knowledge about the school and can answer questions about programs,
          admissions, and more.
        </p>
        <ChatDialogExample />
      </div>
    </div>
  );
}
