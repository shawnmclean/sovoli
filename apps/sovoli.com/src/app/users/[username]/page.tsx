import { notFound } from "next/navigation";
import {
  GetUserKnowledgeByUsernameQuery,
  GetUserKnowledgeByUsernameQueryHandler,
} from "~/modules/notes/services/GetUserKnowledgeByUsername";
import { KnowledgeCard } from "./components/KnowledgeCard";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  // Get user's knowledge items
  const userKnowledgeHandler = new GetUserKnowledgeByUsernameQueryHandler();
  const result = await userKnowledgeHandler.handle(
    new GetUserKnowledgeByUsernameQuery(username),
  );

  if (!result.userKnowledge) {
    notFound();
  }

  const { knowledgeItems } = result.userKnowledge;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {username}'s Knowledge
          </h1>
          <p className="mt-2 text-gray-600">
            {knowledgeItems.length} knowledge items
          </p>
        </div>

        {/* Knowledge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgeItems.map((item) => (
            <KnowledgeCard key={item.id} knowledge={item} username={username} />
          ))}
        </div>

        {/* Empty State */}
        {knowledgeItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No knowledge items yet
            </h3>
            <p className="text-gray-500">
              {username} hasn't created any knowledge items yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
