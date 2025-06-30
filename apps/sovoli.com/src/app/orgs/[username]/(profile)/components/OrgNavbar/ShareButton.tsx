"use client";

import { useState } from "react";
import { ShareIcon } from "lucide-react";
import { Button } from "@sovoli/ui/components/button";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    try {
      const shareData = {
        title,
        text: text ?? `Check out ${title} on Sovoli`,
        url: url ?? window.location.href,
      };

      // Try to use the Web Share API first
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(shareData.url);

        // You could add a toast notification here
        console.log("URL copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      variant="flat"
      isIconOnly
      radius="full"
      onPress={handleShare}
      isLoading={isSharing}
    >
      <ShareIcon />
    </Button>
  );
}
