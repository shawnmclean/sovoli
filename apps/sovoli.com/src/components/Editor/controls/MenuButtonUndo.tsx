import type { Editor } from "@tiptap/core";
import React, { useCallback } from "react";
import { Button } from "@sovoli/ui/components/button";
import { UndoIcon } from "lucide-react";

interface MenuButtonUndoProps {
  editor: Editor;
}

export const MenuButtonUndo = ({ editor }: MenuButtonUndoProps) => {
  const onUndo = useCallback(
    () => editor.chain().focus().undo().run(),
    [editor],
  );

  return (
    <Button
      title="Undo"
      isDisabled={!editor.can().undo()}
      onPress={onUndo}
      isIconOnly
    >
      <UndoIcon />
    </Button>
  );
};
