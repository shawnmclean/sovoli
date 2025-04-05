"use client";

import { upsertNoteAction } from "~/modules/notes/actions/upsertNoteAction";
import { NoteForm } from "~/modules/notes/components/NoteForm";
import { useKnowledge } from "../../context/KnowledgeContext";

export function KnowledgeEdit() {
  const knowledge = useKnowledge();

  return <NoteForm id={knowledge.id} action={upsertNoteAction} />;
}
