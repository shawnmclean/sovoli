"use client";

import { useActionState } from "react";

import type { State } from "../actions/upsertNoteAction";

export interface NoteFormProps {
  id: string;
  action: (state: State, formData: FormData) => Promise<State>;
}

export const NoteForm = ({ id, action }: NoteFormProps) => {
  const [state, formAction, pending] = useActionState<State, FormData>(
    action,
    null,
  );

  return (
    <div>
      <form action={formAction}>
        <input type="text" name="id" value={id} />
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
