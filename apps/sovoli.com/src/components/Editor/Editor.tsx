"use client";

import type { Editor as EditorType } from "@tiptap/react";
import { useEffect } from "react";
import { EditorContent } from "@tiptap/react";

import { EditorMenu } from "./controls/EditorMenu";
import { useSovoliEditor } from "./hooks/useSovoliEditor";

export interface EditorProps {
  name: string;
  defaultValue?: string;
  ref?: React.RefObject<EditorType | null>;
}

export const Editor = ({ name, defaultValue, ref }: EditorProps) => {
  const { editor, editorValue } = useSovoliEditor({ defaultValue });

  useEffect(() => {
    if (editor && ref && "current" in ref) {
      ref.current = editor;
    }
  }, [editor, ref]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative flex h-[500px] w-full flex-col items-start gap-3 overflow-auto rounded-large border-2 border-default-200 shadow-sm focus-within:border-default-foreground hover:border-default-400 hover:focus-within:border-default-foreground">
      <EditorMenu editor={editor} />
      <div className="w-full flex-1 overflow-auto p-2">
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={editorValue} />
    </div>
  );
};
