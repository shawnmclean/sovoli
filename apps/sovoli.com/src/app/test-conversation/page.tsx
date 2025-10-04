"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { ChatDialog } from "../../modules/chat/components/ChatDialog";

export default function TestConversationPage() {
  const [isOpen, setIsOpen] = useState(true);

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

        <ChatDialog isOpen={isOpen} onOpenChange={setIsOpen} />
      </div>
    </div>
  );
}
