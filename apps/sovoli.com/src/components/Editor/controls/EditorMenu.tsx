import type { Editor } from "@tiptap/core";
import { ButtonGroup } from "@sovoli/ui/components/button";

import { MenuButtonBlockquote } from "./MenuButtonBlockquote";
import { MenuButtonBold } from "./MenuButtonBold";
import { MenuButtonLink } from "./MenuButtonLink";
import { MenuButtonRedo } from "./MenuButtonRedo";
import { MenuButtonUndo } from "./MenuButtonUndo";
import { MenuSelectHeading } from "./MenuSelectHeading";

export interface EditorMenuProps {
  editor: Editor;
}

export const EditorMenu = ({ editor }: EditorMenuProps) => {
  return (
    <div className="flex w-full flex-wrap gap-1 border-b border-default-100 p-1 shadow-md">
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
      <ButtonGroup>
        <MenuButtonLink editor={editor} />
      </ButtonGroup>
    </div>
  );
};
