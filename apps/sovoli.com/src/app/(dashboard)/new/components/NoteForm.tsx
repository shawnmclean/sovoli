"use client";

import { useActionState, useState } from "react";
import { Alert } from "@sovoli/ui/components/alert";
import { Button } from "@sovoli/ui/components/button";
import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";

import type { State } from "../actions/newNoteAction";
import { Editor } from "~/components/Editor/Editor";
import { newNoteAction } from "../actions/newNoteAction";

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

  const [fileUploadStatus, setFileUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileUploadStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/ai/images/analyze", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await response.json();
        console.log("File uploaded successfully:", data);
        setFileUploadStatus("success");
      } else {
        console.error("File upload failed:", response.statusText);
        setFileUploadStatus("error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setFileUploadStatus("error");
    }
  };

  return (
    <Form className="w-full" action={formAction}>
      {" "}
      <input type="file" id="image" name="image" onChange={handleFileUpload} />
      {fileUploadStatus === "uploading" && <p>Uploading...</p>}
      {fileUploadStatus === "success" && <p>File uploaded successfully!</p>}
      {fileUploadStatus === "error" && <p>Failed to upload file.</p>}
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
                  {Object.entries(state.errors ?? {}).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}</strong>: {value}
                    </li>
                  ))}
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
    </Form>
  );
};
