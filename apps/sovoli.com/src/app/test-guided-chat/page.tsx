"use client";

import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import { ChatDialog } from "../../modules/chat/components/ChatDialog";
import { MessageCircleIcon } from "lucide-react";

export default function TestGuidedChatPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    defaultOpen: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-default-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Guided Chat System Test
          </h1>
          <p className="text-lg text-default-600">
            Test the guided chat flow for parents and students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parent Flow Test */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg border border-divider">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Parent Flow
            </h2>
            <p className="text-sm text-default-600 mb-4">
              Test the guided chat flow for parents with age selection and
              program recommendations.
            </p>
            <Button
              color="primary"
              startContent={<MessageCircleIcon className="w-4 h-4" />}
              onPress={onOpen}
              className="w-full"
            >
              Start Parent Chat
            </Button>
          </div>

          {/* Student Flow Test */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg border border-divider">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Student Flow
            </h2>
            <p className="text-sm text-default-600 mb-4">
              Test the guided chat flow for students (coming soon).
            </p>
            <Button
              color="secondary"
              startContent={<MessageCircleIcon className="w-4 h-4" />}
              isDisabled
              className="w-full"
            >
              Start Student Chat (Coming Soon)
            </Button>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg border border-divider">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Implemented Features
          </h3>
          <ul className="space-y-2 text-sm text-default-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Parent flow with age selection question
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Quick reply buttons for age selection (2, 3, 4, 5, Other)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Age picker drawer with WheelPicker for precise year/month
              selection
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Program recommendation based on selected age
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <strong>Persistent message history</strong> - Questions and
              responses stay in chat
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <strong>Proper message attribution</strong> - System vs User
              messages
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Extensible flow system for future questions
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Student flow (placeholder for future implementation)
            </li>
          </ul>
        </div>
      </div>

      <ChatDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placeholder="Ask me anything..."
        audience="parent"
      />
    </div>
  );
}
