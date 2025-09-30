import { notFound } from "next/navigation";
import Image from "next/image";
import {
  GetUserKnowledgeByUsernameQuery,
  GetUserKnowledgeByUsernameQueryHandler,
} from "~/modules/notes/services/GetUserKnowledgeByUsername";
import type { KnowledgeFile } from "~/modules/notes/services/types";
import type { Photo } from "~/modules/core/photos/types";

// Type guard for Photo
function isPhoto(obj: unknown): obj is Photo {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "url" in obj &&
    typeof (obj as Photo).url === "string"
  );
}

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

interface KnowledgeCardProps {
  knowledge: KnowledgeFile;
  username: string;
}

function KnowledgeCard({ knowledge, username }: KnowledgeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Cover Image */}
      {isPhoto(knowledge.coverPhoto) && (
        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
          <Image
            src={knowledge.coverPhoto.url}
            alt={knowledge.coverPhoto.alt ?? knowledge.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              knowledge.type === "note"
                ? "bg-blue-100 text-blue-800"
                : knowledge.type === "book"
                  ? "bg-green-100 text-green-800"
                  : knowledge.type === "collection"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {knowledge.type}
          </span>
          {knowledge.isPublic && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Public
            </span>
          )}
          {knowledge.isDraft && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Draft
            </span>
          )}
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {knowledge.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {knowledge.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>
            {(Array.isArray(knowledge.inlinePhotos)
              ? knowledge.inlinePhotos.filter(isPhoto).length
              : 0) + (isPhoto(knowledge.coverPhoto) ? 1 : 0)}{" "}
            photo
            {(Array.isArray(knowledge.inlinePhotos)
              ? knowledge.inlinePhotos.filter(isPhoto).length
              : 0) +
              (isPhoto(knowledge.coverPhoto) ? 1 : 0) !==
            1
              ? "s"
              : ""}
          </span>
          <span>{new Date(knowledge.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Action Button */}
        <a
          href={`/users/${username}/${knowledge.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          View Details
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
