"use client";

import { saveDraftKnowledgeAction } from "~/modules/notes/actions/saveDraftKnowledgeAction";
import { NoteForm } from "~/modules/notes/components/NoteForm";
import { useKnowledge } from "../../context/KnowledgeContext";

export function KnowledgeEdit() {
  const knowledge = useKnowledge();

  return <NoteForm id={knowledge.id} action={saveDraftKnowledgeAction} />;
}
