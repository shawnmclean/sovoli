import { newNoteAction } from "./actions/newNoteAction";
import { NoteForm } from "./components/NoteForm";

export default function NewPage() {
  return (
    <div className="mx-auto max-w-7xl p-4">
      <NoteForm action={newNoteAction} />
    </div>
  );
}
