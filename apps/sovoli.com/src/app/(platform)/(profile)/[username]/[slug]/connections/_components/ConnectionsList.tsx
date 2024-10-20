"use client";

import type {
  SelectKnowledgeConnectionSchema,
  SelectKnowledgeSchema,
} from "@sovoli/db/schema";
import { useState } from "react";
import {
  KnowledgeConnectionType,
  KnowledgeQueryType,
  KnowledgeType,
} from "@sovoli/db/schema";

// import { BarcodeReader } from "@sovoli/ui/components/BarcodeReader";

import { updateKnowledgeAction } from "../actions";

export interface Props {
  knowledge: SelectKnowledgeSchema;
}

export function ConnectionsList({ knowledge }: Props) {
  const [connections, setConnections] = useState<
    SelectKnowledgeConnectionSchema[]
  >(knowledge.SourceConnections ?? []);

  // const handleISBNFound = (isbn: string) => {
  //   // check if isbn is already in the list, then do nothing

  //   setIsbns((prev) => {
  //     if (prev.includes(isbn)) return prev;
  //     return [isbn, ...prev];
  //   });
  //   // const book = await createConnection(isbn);
  //   // if (!book) return;
  //   // setBooks([...books, book]);
  // };

  const handleQuerySubmit = async (formData: FormData) => {
    const query = formData.get("query")?.toString() ?? "";
    const updatedKnowledge = await updateKnowledgeAction({
      knowledge: {
        id: knowledge.id,
        connections: [
          {
            action: "add",
            type: KnowledgeConnectionType.contains,
            targetKnowledge: {
              query,
              queryType: KnowledgeQueryType.isbn,
              type: KnowledgeType.book,
            },
          },
        ],
      },
    });
    const updatedConnection = updatedKnowledge.SourceConnections?.[0];

    if (updatedConnection) {
      setConnections((prev) => [updatedConnection, ...prev]);
    }
  };

  return (
    <div>
      {/* <BarcodeReader onISBNFound={handleISBNFound} /> */}
      <form action={handleQuerySubmit}>
        <input type="text" id="query" name="query" />
        <button type="submit">Add</button>
      </form>

      <ul>
        {connections.map((connection) => (
          <li key={connection.id} className="border-outline-200 m-3 border p-2">
            <h4>{connection.TargetKnowledge?.title}</h4>
            <p>{connection.TargetKnowledge?.type}</p>
            <p>Query: {connection.TargetKnowledge?.query}</p>
            <p>{connection.TargetKnowledge?.jobError}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
