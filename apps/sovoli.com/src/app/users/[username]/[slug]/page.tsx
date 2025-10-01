import { notFound } from "next/navigation";
import {
  GetKnowledgeBySlugQuery,
  GetKnowledgeBySlugQueryHandler,
} from "~/modules/notes/services/GetKnowledgeBySlug";
import {
  GetUserKnowledgeByUsernameQuery,
  GetUserKnowledgeByUsernameQueryHandler,
} from "~/modules/notes/services/GetUserKnowledgeByUsername";
import { KnowledgeContent } from "./components/KnowledgeContent";
import { CoverImage } from "./components/CoverImage";
import { InlinePhotos } from "./components/InlinePhotos";

interface KnowledgePageProps {
  params: Promise<{
    username: string;
    slug: string;
  }>;
}

export default async function KnowledgePage({ params }: KnowledgePageProps) {
  const { username, slug } = await params;

  // Get specific knowledge item
  const knowledgeHandler = new GetKnowledgeBySlugQueryHandler();
  const knowledgeResult = await knowledgeHandler.handle(
    new GetKnowledgeBySlugQuery(username, slug),
  );

  if (!knowledgeResult.knowledge) {
    notFound();
  }

  const knowledge = knowledgeResult.knowledge;

  // Get user's other knowledge items for navigation
  const userKnowledgeHandler = new GetUserKnowledgeByUsernameQueryHandler();
  const userResult = await userKnowledgeHandler.handle(
    new GetUserKnowledgeByUsernameQuery(username),
  );

  const otherItems =
    userResult.userKnowledge?.knowledgeItems.filter(
      (item) => item.slug !== slug,
    ) ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <a href={`/users/${username}`} className="hover:text-gray-700">
              {username}
            </a>
            <span>/</span>
            <span className="text-gray-900">{knowledge.title}</span>
          </nav>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {knowledge.title}
              </h1>
              <p className="text-gray-600 text-lg">{knowledge.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Public
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {knowledge.coverPhoto?.bucket && knowledge.coverPhoto.id && (
          <CoverImage
            bucket={knowledge.coverPhoto.bucket}
            id={knowledge.coverPhoto.id}
            alt={knowledge.coverPhoto.alt ?? knowledge.title}
          />
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            <KnowledgeContent content={knowledge.content} />
          </div>
        </div>

        {/* Inline Photos */}
        {Array.isArray(knowledge.inlinePhotos) &&
          knowledge.inlinePhotos.length > 0 && (
            <InlinePhotos photos={knowledge.inlinePhotos} />
          )}

        {/* Other Items */}
        {otherItems.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              More from {username}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherItems.slice(0, 3).map((item) => (
                <a
                  key={item.id}
                  href={`/users/${username}/${item.slug}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-gray-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.type === "note"
                          ? "bg-blue-100 text-blue-800"
                          : item.type === "book"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Created:</span>
              <br />
              {new Date(knowledge.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Updated:</span>
              <br />
              {new Date(knowledge.updatedAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Photos:</span>
              <br />
              {(Array.isArray(knowledge.inlinePhotos)
                ? knowledge.inlinePhotos.length
                : 0) +
                (knowledge.coverPhoto?.bucket && knowledge.coverPhoto.id
                  ? 1
                  : 0)}
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <br />
              {knowledge.isDraft ? "Draft" : "Published"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
