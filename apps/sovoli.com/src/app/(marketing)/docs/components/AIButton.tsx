"use client";

import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { Button } from "@sovoli/ui/components/button";
import { Sparkles, XIcon } from "lucide-react";

export function AIButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleOpenChatGPT = () => {
    const currentUrl = window.location.href;
    const prompt = `Read from this URL: ${currentUrl} and explain it to me.`;
    const encodedPrompt = encodeURIComponent(prompt);
    const chatgptUrl = `https://chatgpt.com/?prompt=${encodedPrompt}`;
    window.open(chatgptUrl, "_blank");
  };

  return (
    <>
      <Button
        isIconOnly
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
        color="primary"
        size="lg"
        onPress={onOpen}
        aria-label="Open AI Assistant"
      >
        <Sparkles size={24} />
      </Button>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        size="md"
        hideCloseButton
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader
                title="AI Assistant"
                endContent={
                  <Button
                    isIconOnly
                    onPress={onClose}
                    variant="light"
                    aria-label="Close"
                  >
                    <XIcon size={24} />
                  </Button>
                }
              />
              <DrawerBody className="pb-6">
                <div className="space-y-4">
                  <p className="text-sm text-default-600">
                    Get help with this documentation page using AI.
                  </p>
                  <Button
                    fullWidth
                    color="primary"
                    variant="flat"
                    onPress={handleOpenChatGPT}
                    startContent={<Sparkles size={20} />}
                  >
                    Open in ChatGPT
                  </Button>
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
