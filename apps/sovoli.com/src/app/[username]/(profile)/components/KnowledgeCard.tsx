"use client";

import { Badge } from "@sovoli/ui/components/badge";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { CldImage } from "next-cloudinary";
import type { Media } from "~/modules/core/media/types";
import type { KnowledgeFile } from "~/modules/notes/services/types";

// Type guard for cover photo
function hasCoverPhoto(knowledge: KnowledgeFile): knowledge is KnowledgeFile & {
  coverPhoto: Media & { type: "image"; bucket: string; id: string };
} {
  return !!(
    knowledge.coverPhoto?.type === "image" &&
    knowledge.coverPhoto.bucket &&
    knowledge.coverPhoto.id
  );
}

interface KnowledgeCardProps {
  knowledge: KnowledgeFile;
  username: string;
}

export function KnowledgeCard({ knowledge, username }: KnowledgeCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      {/* Cover Image */}
      {hasCoverPhoto(knowledge) && (
        <div className="aspect-video bg-default-100 rounded-t-lg overflow-hidden relative">
          <CldImage
            src={`${knowledge.coverPhoto.bucket}/${knowledge.coverPhoto.id}`}
            alt={knowledge.coverPhoto.alt ?? knowledge.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}

      <CardBody className="p-6">
        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-3">
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
          {knowledge.isDraft && (
            <Badge color="warning" size="sm">
              Draft
            </Badge>
          )}
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {knowledge.title}
        </h3>
        <p className="text-default-600 text-sm mb-4 line-clamp-3">
          {knowledge.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-default-500 mb-4">
          <span>
            {(Array.isArray(knowledge.inlinePhotos)
              ? knowledge.inlinePhotos.length
              : 0) + (hasCoverPhoto(knowledge) ? 1 : 0)}{" "}
            photo
            {(Array.isArray(knowledge.inlinePhotos)
              ? knowledge.inlinePhotos.length
              : 0) +
              (hasCoverPhoto(knowledge) ? 1 : 0) !==
            1
              ? "s"
              : ""}
          </span>
          <span>{new Date(knowledge.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Action Button */}
        <Link
          href={`/${username}/${knowledge.slug}`}
          className="inline-flex items-center text-primary hover:text-primary-600 font-medium text-sm"
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
        </Link>
      </CardBody>
    </Card>
  );
}
