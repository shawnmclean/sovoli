"use client";

import { ButtonGroup } from "@sovoli/ui/components/button";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { MenuButtonRedo } from "./controls/MenuButtonRedo";
import { MenuButtonUndo } from "./controls/MenuButtonUndo";
import { MenuSelectHeading } from "./controls/MenuSelectHeading";

export const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌎️</p>",
  });

  if (!editor) return null;

  return (
    <div>
      <ButtonGroup variant="light">
        <MenuButtonUndo editor={editor} />
        <MenuButtonRedo editor={editor} />
      </ButtonGroup>
      <MenuSelectHeading editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
