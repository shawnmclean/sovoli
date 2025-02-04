"use client";

import type { Editor as EditorType } from "@tiptap/react";
import { useActionState, useRef, useState } from "react";
import { Alert } from "@sovoli/ui/components/alert";
import { Button } from "@sovoli/ui/components/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";
import { Spinner } from "@sovoli/ui/components/spinner";
import { User } from "@sovoli/ui/components/user";
import { ChevronDownIcon, PlusIcon, Trash2Icon } from "lucide-react";

import type { UploadSignature } from "../../../../modules/mediaAssets/lib/generateUploadSignatures";
import type { State } from "../actions/newNoteAction";
import type { UploadedAsset } from "~/modules/mediaAssets/hooks/useAssetFileUpload";
import { Editor } from "~/components/Editor/Editor";
import { AssetManager } from "~/modules/mediaAssets/components/AssetManager";

export interface NoteFormProps {
  title?: string;
  description?: string;
  content?: string;
  action: (state: State, formData: FormData) => Promise<State>;
  uploadSignatures: UploadSignature[];
}

export const NoteForm = ({
  title,
  description,
  content,
  action,
  uploadSignatures,
}: NoteFormProps) => {
  const [formTitle, setFormTitle] = useState<string>(title ?? "");
  const [formDescription, setFormDescription] = useState<string>(
    description ?? "",
  );

  const editorRef = useRef<EditorType | null>(null);
  const [state, formAction, pending] = useActionState<State, FormData>(
    action,
    null,
  );
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [insertContent, setInsertContent] = useState<boolean>(false);

  const onFileUploaded = async (asset: UploadedAsset) => {
    setAiLoading(true);
    const response = await fetch("/api/ai/images/analyze", {
      method: "POST",
      body: JSON.stringify({
        url: asset.url,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to analyze image");
    }
    const responseBody = (await response.json()) as {
      page: number;
      chapter: string;
      highlights: string[];
    };

    const content = responseBody.highlights.flatMap((highlight) => [
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

    // Insert all content at once
    editorRef.current?.commands.insertContent(content);
    setInsertContent(true);
    setFormTitle(`Annotation from "The Magic of Believing": Mind Over Matter`);
    setFormDescription(
      "Exploring J.B. Rhine's Groundbreaking Studies on Psychokinesis and the Power of the Mind to Influence Physical Objects",
    );
    setAiLoading(false);
  };

  return (
    <Form className="w-full" action={formAction}>
      <AssetManager
        name="assets"
        onChange={async (assets) => {
          for (const asset of assets) {
            if (asset.type === "added") {
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
        classNames={{
          input: "font-bold text-3xl",
        }}
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
      />
      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 py-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Input
            name="description"
            placeholder="Description"
            fullWidth
            variant="bordered"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
          <Editor name="content" defaultValue={content} ref={editorRef} />
          <div className="flex w-full justify-between gap-2">
            <div className="w-full">
              {state?.status === "error" && (
                <Alert
                  title={state.message}
                  color="danger"
                  description={
                    <ul>
                      {Object.entries(state.errors ?? {}).map(
                        ([key, value]) => (
                          <li key={key}>
                            <strong>{key}</strong>: {value}
                          </li>
                        ),
                      )}
                    </ul>
                  }
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button color="primary" type="submit" isLoading={pending}>
                Create
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <span>Main Reference:</span>
            <div className="flex items-center justify-between gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <div className="flex w-full flex-row items-center justify-between rounded-md border-1 border-default-200 p-2">
                    <User
                      as="button"
                      avatarProps={{
                        radius: "none",
                        src: "https://images.isbndb.com/covers/8575293482361.jpg",
                      }}
                      description="Book by Claude M. Bristol"
                      name="Magic Of Believing"
                    />
                    <ChevronDownIcon />
                  </div>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="book-1">Test</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Button isIconOnly color="danger" variant="light">
                <Trash2Icon />
              </Button>
            </div>
            {insertContent && (
              <div className="flex flex-col gap-1 text-sm text-default-500">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Chapter:</span>
                  <span>MIND-STUFF EXPERIMENTS</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Pages:</span>
                  <span>27</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <span>Supplemental References:</span>

            <div className="flex items-center justify-between gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <div className="flex w-full flex-row items-center justify-between rounded-md border-1 border-default-200 p-2">
                    <div className="flex flex-col gap-1">
                      <div className="inline-flex flex-col items-start">
                        <span className="text-small text-inherit">Ego</span>
                        <span className="text-tiny text-foreground-400">
                          Research by Shawn
                        </span>
                      </div>
                    </div>
                    <ChevronDownIcon />
                  </div>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="book-1">Test</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Button isIconOnly color="danger" variant="light">
                <Trash2Icon />
              </Button>
            </div>
            <Button isIconOnly variant="light">
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};
