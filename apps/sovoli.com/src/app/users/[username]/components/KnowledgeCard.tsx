"use client";

import { CldImage } from "next-cloudinary";
import type { KnowledgeFile } from "~/modules/notes/services/types";
import type { Photo } from "~/modules/core/photos/types";

// Type guard for cover photo
function hasCoverPhoto(knowledge: KnowledgeFile): knowledge is KnowledgeFile & {
  coverPhoto: Photo & { bucket: string; id: string };
} {
  return !!(knowledge.coverPhoto?.bucket && knowledge.coverPhoto.id);
}

interface KnowledgeCardProps {
  knowledge: KnowledgeFile;
  username: string;
}

export function KnowledgeCard({ knowledge, username }: KnowledgeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Cover Image */}
      {hasCoverPhoto(knowledge) && (
        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden relative">
          <CldImage
            src={`${knowledge.coverPhoto.bucket}/${knowledge.coverPhoto.id}`}
            alt={knowledge.coverPhoto.alt ?? knowledge.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
