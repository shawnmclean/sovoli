import { Badge } from "@sovoli/ui/components/badge";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCldOgImageUrl } from "next-cloudinary";
import {
  GetKnowledgeBySlugQuery,
  GetKnowledgeBySlugQueryHandler,
} from "~/modules/notes/services/GetKnowledgeBySlug";
import {
  GetUserKnowledgeByUsernameQuery,
  GetUserKnowledgeByUsernameQueryHandler,
} from "~/modules/notes/services/GetUserKnowledgeByUsername";
import { config } from "~/utils/config";
import { CoverImage } from "./components/CoverImage";
import { InlinePhotos } from "./components/InlinePhotos";
import { KnowledgeContent } from "./components/KnowledgeContent";

interface KnowledgePageProps {
  params: Promise<{
    username: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}): Promise<Metadata> {
  const { username, slug } = await params;

  // Get specific knowledge item
  const knowledgeHandler = new GetKnowledgeBySlugQueryHandler();
  const knowledgeResult = await knowledgeHandler.handle(
    new GetKnowledgeBySlugQuery(username, slug),
  );

  if (!knowledgeResult.knowledge) {
    return {
      title: `Knowledge not found - ${config.siteName}`,
      description: `The knowledge item "${slug}" by ${username} could not be found.`,
    };
  }

  const knowledge = knowledgeResult.knowledge;

  // Generate cover image URL if available
  const coverImageUrl =
    knowledge.coverPhoto?.bucket && knowledge.coverPhoto.id
      ? getCldOgImageUrl({
          src: `${knowledge.coverPhoto.bucket}/${knowledge.coverPhoto.id}`,
        })
      : null;

  const description = knowledge.description.trim()
    ? knowledge.description
    : `Read ${knowledge.title} by ${username} on ${config.siteName}`;

  return {
    title: `${knowledge.title} - ${username}`,
    description: description,
    openGraph: {
      title: `${knowledge.title} - ${username}`,
      description: description,
      url: `${config.url}/users/${username}/${slug}`,
      siteName: config.siteName,
      images: coverImageUrl ? [coverImageUrl] : config.images,
    },
  };
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
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-default-500 mb-4">
            <Link href={`/${username}`} className="hover:text-default-700">
              {username}
            </Link>
            <span>/</span>
            <span className="text-foreground">{knowledge.title}</span>
          </nav>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {knowledge.title}
              </h1>
              <p className="text-default-600 text-lg">
                {knowledge.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                color={
                  knowledge.type === "note"
                    ? "primary"
                    : knowledge.type === "book"
                      ? "success"
                      : knowledge.type === "collection"
                        ? "secondary"
                        : "default"
                }
                size="sm"
              >
                {knowledge.type}
              </Badge>
              {knowledge.isPublic && (
                <Badge color="success" size="sm">
                  Public
                </Badge>
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
        <Card className="p-8">
          <CardBody className="p-0">
            <KnowledgeContent content={knowledge.content} />
          </CardBody>
        </Card>

        {/* Inline Photos */}
        {Array.isArray(knowledge.inlinePhotos) &&
          knowledge.inlinePhotos.length > 0 && (
            <InlinePhotos photos={knowledge.inlinePhotos} />
          )}

        {/* Other Items */}
        {otherItems.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              More from {username}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherItems.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/${username}/${item.slug}`}
                  className="block"
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <CardBody className="p-0">
                      <h4 className="font-medium text-foreground mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-default-600 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="mt-2">
                        <Badge
                          color={
                            item.type === "note"
                              ? "primary"
                              : item.type === "book"
                                ? "success"
                                : "default"
                          }
                          size="sm"
                        >
                          {item.type}
                        </Badge>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-8 pt-8 border-t border-divider">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-default-500">
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
