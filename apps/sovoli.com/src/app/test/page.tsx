"use client";

import { useFormState } from "react-dom";

import type { State } from "./action";
import { testAction } from "./action";

export default function TestPage() {
  const [state, testFormAction] = useFormState<State, FormData>(
    testAction,
    null,
  );
  return (
    <div>
      <h1>Test Page</h1>
      <form method="post" action={testFormAction}>
        <input type="text" name="id" />
        <input type="submit" value="Submit" />
      </form>
      {state?.message && <p>{state.message}</p>}
    </div>
  );
}
