"use client";

import type {
  SelectKnowledgeConnectionSchema,
  SelectKnowledgeSchema,
} from "@sovoli/db/schema";
import { useState } from "react";
import Image from "next/image";
import {
  KnowledgeConnectionType,
  KnowledgeQueryType,
  KnowledgeType,
} from "@sovoli/db/schema";
import { BarcodeReader } from "@sovoli/ui/components/BarcodeReader";

import { updateKnowledgeAction } from "../actions";

export interface Props {
  knowledge: SelectKnowledgeSchema;
}

export function ConnectionsList({ knowledge }: Props) {
  const [connections, setConnections] = useState<
    SelectKnowledgeConnectionSchema[]
  >(knowledge.SourceConnections ?? []);
  const [error, setError] = useState<string | null>(null);
  const [recentScan, setRecentScan] = useState<string | null>(null);

  const handleConnectionAdd = async (query: string) => {
    // TODO: detect wether query is ISBN or title
    setError(null);
    setRecentScan(query);
    // ensure theres no duplications
    // TODO: we need to run checks against the book isbns
    if (connections.some((c) => c.TargetKnowledge?.query === query)) {
      setError("This query is already in the list");
      return;
    }

    // TODO: Handle duplicate key constraints (duplicate connections)
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

  const handleQuerySubmit = async (formData: FormData) => {
    const query = formData.get("query")?.toString() ?? "";
    await handleConnectionAdd(query);
  };

  return (
    <div>
      <BarcodeReader onISBNFound={handleConnectionAdd} />
      <form action={handleQuerySubmit}>
        <input type="text" id="query" name="query" />
        <button type="submit">Add</button>
      </form>
      {recentScan && <p className="text-green-500">{recentScan}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {connections.map((connection) => (
          <li
            key={connection.id}
            className="border-outline-200 m-3 flex items-start border p-2"
          >
            {connection.TargetKnowledge?.Book?.image && (
              <div className="relative mr-4 h-28 w-20">
                <Image
                  src={connection.TargetKnowledge.Book.image}
                  alt="book cover"
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            )}
            <div>
              <h4>{connection.TargetKnowledge?.title}</h4>
              <p>{connection.TargetKnowledge?.type}</p>
              <p>Query: {connection.TargetKnowledge?.query}</p>
              <p>{connection.TargetKnowledge?.jobError}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
