"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { ChatDialog } from "../../modules/chat/components/ChatDialog";
import type { ConversationFormConfig } from "../../modules/chat/types/conversation-form";

export default function TestConversationPage() {
  const [isOpen, setIsOpen] = useState(false);

  // Example configuration for a child's age and additional questions
  const conversationConfig: ConversationFormConfig = {
    questions: [
      {
        id: "child-age",
        type: "wheel-picker",
        label: "What's your child's age?",
        placeholder:
          "Please select your child's age to help us provide better recommendations",
        required: true,
        options: Array.from({ length: 18 }, (_, i) => ({
          value: i + 1,
          label: `${i + 1} year${i === 0 ? "" : "s"} old`,
        })),
        defaultValue: 5,
      },
      {
        id: "child-name",
        type: "text-input",
        label: "What's your child's name?",
        placeholder: "Enter your child's first name",
        required: true,
        maxLength: 50,
      },
      {
        id: "interests",
        type: "text-input",
        label: "What are your child's main interests?",
        placeholder:
          "Tell us about activities, subjects, or hobbies your child enjoys",
        multiline: true,
        maxLength: 500,
      },
      {
        id: "learning-goals",
        type: "text-input",
        label: "What are your learning goals for your child?",
        placeholder: "What would you like your child to achieve or learn?",
        multiline: true,
        maxLength: 500,
      },
    ],
    onComplete: (responses) => {
      console.log("Form completed with responses:", responses);
      // Here you can process the responses and potentially send them to your AI
    },
    showProgress: true,
    allowBackNavigation: true,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Conversation Form Test
          </h1>
          <p className="text-lg text-default-600">
            Test the AI conversation form with wheel picker and other input
            types
          </p>
        </div>

        <div className="max-w-md mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            AI-Powered Education Assistant
          </h2>
          <p className="text-default-600">
            Let's start by learning about your child to provide personalized
            recommendations.
          </p>
          <Button color="primary" size="lg" onPress={() => setIsOpen(true)}>
            Start Questionnaire
          </Button>
        </div>

        <ChatDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          conversationConfig={conversationConfig}
          showConversationForm={true}
        />
      </div>
    </div>
  );
}
