import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { useKnowledge } from "../../context/KnowledgeContext";
import { HeaderActions } from "../HeaderActions";

export function KnowledgeTitle() {
  const knowledge = useKnowledge();
  const { data: session } = useSession();

  return (
    <div className="flex w-full max-w-7xl items-center justify-between pb-6">
      <div className="flex items-center gap-2">
        {knowledge.type === "shelf" && (
          <Link
            href={`/${knowledge.User?.username}/shelves`}
            title="Back to shelves"
            className="hover:text-primary-dark flex items-center text-primary"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Link>
        )}
        <h1 className="text-2xl font-bold">{knowledge.title}</h1>
      </div>
      <div className="flex gap-4">
        {session?.userId === knowledge.User?.id && (
          <HeaderActions knowledge={knowledge} session={session} />
        )}
      </div>
    </div>
  );
}
