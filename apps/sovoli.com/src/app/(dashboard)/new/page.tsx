import { NoteForm } from "./components/NoteForm";

export default function NewPage() {
  const json = `{
    "type": "doc",
    "content": [
      {
      }
    ]
  }`;
  return (
    <div className="mx-auto max-w-7xl p-4">
      <NoteForm title="" description="" content={json} />
    </div>
  );
}
