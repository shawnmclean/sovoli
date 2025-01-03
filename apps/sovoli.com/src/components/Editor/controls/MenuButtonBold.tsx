import type { Editor } from "@tiptap/core";
import React, { useCallback } from "react";
import { Button } from "@sovoli/ui/components/button";
import { BoldIcon } from "lucide-react";

interface MenuButtonBoldProps {
  editor: Editor;
}

export const MenuButtonBold = ({ editor }: MenuButtonBoldProps) => {
  const toggleBold = useCallback(
    () => editor.chain().focus().toggleBold().run(),
    [editor],
  );

  return (
    <Button
      title="Bold"
      onPress={toggleBold}
      isIconOnly
      variant={editor.isActive("bold") ? "solid" : "light"}
      className="text-default-500"
    >
      <BoldIcon />
    </Button>
  );
};
