import type { Editor } from "@tiptap/core";
import React, { useCallback } from "react";
import { Button } from "@sovoli/ui/components/button";
import { RedoIcon } from "lucide-react";

interface MenuButtonRedoProps {
  editor: Editor;
}

export const MenuButtonRedo = ({ editor }: MenuButtonRedoProps) => {
  const onUndo = useCallback(
    () => editor.chain().focus().redo().run(),
    [editor],
  );

  return (
    <Button
      title="Redo"
      isDisabled={!editor.can().redo()}
      onPress={onUndo}
      isIconOnly
    >
      <RedoIcon />
    </Button>
  );
};
