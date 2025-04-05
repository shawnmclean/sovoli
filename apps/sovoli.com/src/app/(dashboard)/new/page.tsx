import { generateUploadSignatures } from "~/modules/mediaAssets/lib/generateUploadSignatures";
import { upsertNoteAction } from "~/modules/notes/actions/upsertNoteAction";
import { NoteForm } from "~/modules/notes/components/NoteForm";

export default function NewPage() {
  const uploadSignatures = generateUploadSignatures(1);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <NoteForm action={upsertNoteAction} uploadSignatures={uploadSignatures} />
    </div>
  );
}
