import type { JSONContent } from "@tiptap/core";
import { generateHTML as tiptapGenerateHTML } from "@tiptap/html";

import { extensions } from "./extensions";

export const generateHTML = (content: JSONContent) => {
  return tiptapGenerateHTML(content, extensions);
};
