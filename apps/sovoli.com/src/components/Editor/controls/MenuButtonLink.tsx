import type { Editor } from "@tiptap/core";
import React, { useCallback } from "react";
import { Button } from "@sovoli/ui/components/button";
import { LinkIcon } from "lucide-react";

interface MenuButtonLinkProps {
  editor: Editor;
}

export const MenuButtonLink = ({ editor }: MenuButtonLinkProps) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href as string;

    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  return (
    <Button
      title="Link"
      onPress={setLink}
      isIconOnly
      variant="light"
      className="text-default-500"
    >
      <LinkIcon />
    </Button>
  );
};
