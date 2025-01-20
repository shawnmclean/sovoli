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
    <div className="sticky top-0 left-0 right-0 z-50 flex w-full flex-wrap gap-1 border-b border-default-100 bg-white p-1 shadow-md">
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
