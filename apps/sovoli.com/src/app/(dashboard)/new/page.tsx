import { newNoteAction } from "./actions/newNoteAction";
import { NoteForm } from "./components/NoteForm";
import { generateUploadSignatures } from "./lib/generateUploadSignatures";

export default function NewPage() {
  const uploadSignatures = generateUploadSignatures(5);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <NoteForm action={newNoteAction} uploadSignatures={uploadSignatures} />
    </div>
  );
}
