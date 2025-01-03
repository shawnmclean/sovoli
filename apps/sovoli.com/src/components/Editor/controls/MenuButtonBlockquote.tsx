import type { Editor } from "@tiptap/core";
import React, { useCallback } from "react";
import { Button } from "@sovoli/ui/components/button";
import { QuoteIcon } from "lucide-react";

interface MenuButtonBlockquoteProps {
  editor: Editor;
}

export const MenuButtonBlockquote = ({ editor }: MenuButtonBlockquoteProps) => {
  const toggleBlockquote = useCallback(
    () => editor.chain().focus().toggleBlockquote().run(),
    [editor],
  );

  return (
    <Button
      title="Blockquote"
      onPress={toggleBlockquote}
      isIconOnly
      variant={editor.isActive("blockquote") ? "solid" : "light"}
      className="text-default-500"
    >
      <QuoteIcon />
    </Button>
  );
};
