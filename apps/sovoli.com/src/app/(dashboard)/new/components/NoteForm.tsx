"use client";

import { useActionState, useState } from "react";
import { Alert } from "@sovoli/ui/components/alert";
import { Button } from "@sovoli/ui/components/button";
import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";
import { Spinner } from "@sovoli/ui/components/spinner";

import type { State } from "../actions/newNoteAction";
import type { UploadedAsset } from "~/hooks/useAssetFileUpload";
import { Editor } from "~/components/Editor/Editor";
import { newNoteAction } from "../actions/newNoteAction";
import { AssetManager } from "./AssetManager";

export interface NoteFormProps {
  title?: string;
  description?: string;
  content?: string;
}

export const NoteForm = ({ title, description, content }: NoteFormProps) => {
  const [state, formAction, pending] = useActionState<State, FormData>(
    newNoteAction,
    null,
  );
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [annotations, setAnnotations] = useState<
    { page: number; chapter: string; highlights: string[] }[]
  >([]);

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const responseBody = (await response.json()) as {
      page: number;
      chapter: string;
      highlights: string[];
    };

    setAnnotations((current) => [...current, responseBody]);

    setAiLoading(false);
  };

  return (
    <Form className="w-full" action={formAction}>
      <AssetManager onFileUploaded={onFileUploaded} />

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
        defaultValue={title}
      />
      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 py-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Input
            name="description"
            placeholder="Description"
            fullWidth
            variant="bordered"
            defaultValue={description}
          />
          <Editor name="content" defaultValue={content} />
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
          side info
          {annotations.length > 0 && (
            <div className="flex flex-col gap-2">
              {annotations.map((annotation, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="w-full">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Page {annotation.page}
                      </p>
                      <p className="text-lg font-bold">{annotation.chapter}</p>
                    </div>
                  </div>
                  {annotation.highlights.map((highlight, j) => (
                    <div key={j} className="flex gap-2">
                      <div className="w-full">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {highlight}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};
