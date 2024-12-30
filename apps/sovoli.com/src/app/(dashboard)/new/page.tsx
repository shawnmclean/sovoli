import { NoteForm } from "./components/NoteForm";

export default function NewPage() {
  const json = `{
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Example "
          },
          {
            "type": "text",
            "marks": [
              {
                "type": "bold"
              }
            ],
            "text": "Text"
          }
        ]
      }
    ]
  }`;
  return (
    <div className="mx-auto max-w-7xl p-4">
      <NoteForm
        title="Hello World"
        description="This is a test"
        content={json}
      />
    </div>
  );
}
