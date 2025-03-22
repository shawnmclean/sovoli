import type { Editor } from "@tiptap/react";
import { useEffect, useMemo, useRef } from "react";
import FileHandler from "@tiptap-pro/extension-file-handler";
import { useEditor } from "@tiptap/react";

import { useAssetFileUpload } from "~/modules/mediaAssets/hooks/useAssetFileUpload";
import { extensions } from "../extensions";
import { useEditorContent } from "./useEditorContent";

export interface SovoliEditorOptions {
  defaultValue?: string;
}

export function useSovoliEditor({ defaultValue }: SovoliEditorOptions) {
  const editorRef = useRef<Editor | null>(null);
  const pendingDrops = useRef(new Map<File, number>());
  // Track which files have already been inserted (with preview URLs)
  const insertedFiles = useRef(new Set<File>());

  const { jsonContent, editorValue, setEditorValue } =
    useEditorContent(defaultValue);

  const { files, addFiles } = useAssetFileUpload({});

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    files.forEach((fileState) => {
      // Get the drop position for this file if it exists
      const dropPos = pendingDrops.current.get(fileState.file);

      if (dropPos !== undefined) {
        // If the file hasn't been inserted yet, insert it with the preview URL
        if (!insertedFiles.current.has(fileState.file)) {
          editor
            .chain()
            .insertContentAt(dropPos, {
              type: "image",
              attrs: {
                src: fileState.preview,
              },
            })
            .run();

          // Mark this file as inserted
          insertedFiles.current.add(fileState.file);
        }
        // If the file has been inserted and is now uploaded successfully
        else if (fileState.status === "success" && fileState.uploadedAsset) {
          // Find and update all occurrences of this image
          editor.view.state.doc.descendants((node) => {
            if (
              node.type.name === "image" &&
              node.attrs.src === fileState.preview
            ) {
              editor.commands.updateAttributes("image", {
                src: fileState.uploadedAsset?.url,
              });
            }
            return true;
          });

          // We're done with this file
          pendingDrops.current.delete(fileState.file);
        }
      }
    });
  }, [files]);

  const editorExtensions = useMemo(() => {
    return [
      ...extensions,
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (_, files, pos) => {
          const filesArray = Array.from(files);
          for (const file of filesArray) {
            pendingDrops.current.set(file, pos);
          }
          addFiles(filesArray);
        },
      }),
    ];
  }, [addFiles]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    editorProps: {
      attributes: {
        class:
          "w-full max-w-full py-6 px-8 prose prose-base prose-blue prose-headings:scroll-mt-[80px] focus:outline-none",
      },
    },
    content: jsonContent,
    onBeforeCreate: ({ editor }) => {
      editorRef.current = editor;
    },

    onDestroy: () => {
      editorRef.current = null;
      pendingDrops.current.clear();
      insertedFiles.current.clear();
    },

    onUpdate: ({ editor }) => {
      // TODO: performance issues may arise here, use debounce later
      setEditorValue(JSON.stringify(editor.getJSON()));
    },
  });

  return {
    editor,
    editorValue,
  };
}
