"use client";

import { useActionState } from "react";

import type { State } from "../actions/upsertNoteAction";
import { upsertNoteAction } from "../actions/upsertNoteAction";

export interface NoteFormProps {
  slugOrId: string;
}

export const NoteForm = ({ slugOrId }: NoteFormProps) => {
  const [state, formAction, pending] = useActionState<State, FormData>(
    upsertNoteAction,
    null,
  );

  return (
    <div>
      <form action={formAction}>
        <input type="text" name="title" value={slugOrId} />
        <input type="submit" value="Submit" />
      </form>
      {state?.status === "error" && (
        <div>
          <p>Error: {state.message}</p>
          {state.errors && (
            <ul>
              {Object.entries(state.errors).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}</strong>: {value}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {pending && <p>Pending...</p>}
    </div>
  );
};
