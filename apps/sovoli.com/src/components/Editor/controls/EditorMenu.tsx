import type { Editor } from "@tiptap/core";
import { ButtonGroup } from "@sovoli/ui/components/button";

import { MenuButtonBlockquote } from "./MenuButtonBlockquote";
import { MenuButtonBold } from "./MenuButtonBold";
import { MenuButtonRedo } from "./MenuButtonRedo";
import { MenuButtonUndo } from "./MenuButtonUndo";
import { MenuSelectHeading } from "./MenuSelectHeading";

export interface EditorMenuProps {
  editor: Editor;
}

export const EditorMenu = ({ editor }: EditorMenuProps) => {
  return (
    <div className="sticky top-0 z-50 flex flex-wrap gap-1 border-b-1 border-default-100 p-1">
      <ButtonGroup variant="light" size="sm">
        <MenuButtonUndo editor={editor} />
        <MenuButtonRedo editor={editor} />
      </ButtonGroup>
      <MenuSelectHeading editor={editor} />
      <ButtonGroup variant="light" size="sm">
        <MenuButtonBold editor={editor} />
      </ButtonGroup>
      <ButtonGroup variant="light" size="sm">
        <MenuButtonBlockquote editor={editor} />
      </ButtonGroup>
    </div>
  );
};
