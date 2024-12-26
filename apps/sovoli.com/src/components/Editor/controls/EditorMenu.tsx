import type { Editor } from "@tiptap/core";
import { ButtonGroup } from "@sovoli/ui/components/button";

import { MenuButtonRedo } from "./MenuButtonRedo";
import { MenuButtonUndo } from "./MenuButtonUndo";
import { MenuSelectHeading } from "./MenuSelectHeading";

export interface EditorMenuProps {
  editor: Editor;
}

export const EditorMenu = ({ editor }: EditorMenuProps) => {
  return (
    <div className="flex flex-wrap gap-1 border-b-1 border-default-100 p-1">
      <ButtonGroup variant="light">
        <MenuButtonUndo editor={editor} />
        <MenuButtonRedo editor={editor} />
      </ButtonGroup>
      <MenuSelectHeading editor={editor} />
    </div>
  );
};
