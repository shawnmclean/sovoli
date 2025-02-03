import { generateUploadSignatures } from "~/modules/mediaAssets/lib/generateUploadSignatures";
import { newNoteAction } from "./actions/newNoteAction";
import { NoteForm } from "./components/NoteForm";

export default function NewPage() {
  const uploadSignatures = generateUploadSignatures(1);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <NoteForm action={newNoteAction} uploadSignatures={uploadSignatures} />
    </div>
  );
}
