"use client";

import type { Editor as EditorType } from "@tiptap/react";
import { useActionState, useRef, useState } from "react";
import { Alert } from "@sovoli/ui/components/alert";
import { Button } from "@sovoli/ui/components/button";
import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";
import { Spinner } from "@sovoli/ui/components/spinner";

import type { State } from "../actions/upsertNoteAction";
import type { UploadSignature } from "~/modules/mediaAssets/lib/generateUploadSignatures";
import type { UploadedAsset } from "~/modules/mediaAssets/lib/uploadToCloudinary";
import { Editor } from "~/components/Editor/Editor";
import { AssetManager } from "~/modules/mediaAssets/components/AssetManager";

export interface NoteFormProps {
  id?: string;
  title?: string;
  description?: string;
  content?: string;
  uploadSignatures?: UploadSignature[];
  action: (state: State, formData: FormData) => Promise<State>;
}

export const NoteForm = ({
  id,
  title = "",
  description = "",
  content = "",
  uploadSignatures,
  action,
}: NoteFormProps) => {
  const [formTitle, setFormTitle] = useState(title);
  const [formDescription, setFormDescription] = useState(description);
  const editorRef = useRef<EditorType | null>(null);

  const [state, formAction, pending] = useActionState<State, FormData>(
    action,
    null,
  );

  const [aiLoading, setAiLoading] = useState(false);

  const onFileUploaded = async (asset: UploadedAsset) => {
    setAiLoading(true);
    const response = await fetch("/api/ai/images/analyze", {
      method: "POST",
      body: JSON.stringify({ url: asset.url }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze image");
    }

    const responseBody = (await response.json()) as {
      page: number;
      chapter: string;
      highlights: string[];
    };

    const blocks = responseBody.highlights.flatMap((highlight: string) => [
      {
        type: "blockquote",
        content: [
          { type: "paragraph", content: [{ type: "text", text: highlight }] },
        ],
      },
      {
        type: "paragraph",
        content: [],
      },
    ]);

    editorRef.current?.commands.insertContent(blocks);

    setFormTitle(`Annotation from "The Magic of Believing": Mind Over Matter`);
    setFormDescription(
      "Exploring J.B. Rhine's Groundbreaking Studies on Psychokinesis and the Power of the Mind to Influence Physical Objects",
    );
    setAiLoading(false);
  };

  return (
    <Form className="w-full" action={formAction}>
      <input type="hidden" name="id" value={id} />

      <AssetManager
        name="assets"
        onChange={async (assets) => {
          for (const asset of assets) {
            if (asset.type === "added" && asset.asset) {
              await onFileUploaded(asset.asset);
            }
          }
        }}
        uploadSignatures={uploadSignatures}
      />

      {aiLoading && (
        <div className="flex items-center justify-center">
          <Spinner className="h-6 w-6" />
        </div>
      )}

      <Input
        placeholder="Title"
        name="title"
        fullWidth
        size="lg"
        variant="bordered"
        classNames={{ input: "font-bold text-3xl" }}
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
      />

      <Input
        name="description"
        placeholder="Description"
        fullWidth
        variant="bordered"
        value={formDescription}
        onChange={(e) => setFormDescription(e.target.value)}
      />
      <Editor name="content" defaultValue={content} ref={editorRef} />

      <div className="flex w-full justify-between">
        {state?.status === "error" && (
          <Alert
            title={state.message}
            color="danger"
            description={
              <ul>
                {Object.entries(state.errors ?? {}).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}</strong>: {value}
                  </li>
                ))}
              </ul>
            }
          />
        )}
        <Button color="primary" type="submit" isLoading={pending}>
          Save
        </Button>
      </div>
    </Form>
  );
};
