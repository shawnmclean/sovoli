"use client";

import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { KnowledgeCard } from "./KnowledgeCard";
import type { KnowledgeFile } from "~/modules/notes/services/types";

interface UserKnowledgeProfileProps {
  username: string;
  knowledgeItems: KnowledgeFile[];
  page: number;
  pageSize: number;
}

export function UserKnowledgeProfile({
  username,
  knowledgeItems,
  page,
  pageSize,
}: UserKnowledgeProfileProps) {
  // Calculate pagination
  const totalItems = knowledgeItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = knowledgeItems.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {username}'s Knowledge
          </h1>
          <p className="mt-2 text-default-600">
            {totalItems} knowledge items
            {totalPages > 1 && (
              <span className="ml-2">
                (Page {page} of {totalPages})
              </span>
            )}
          </p>
        </div>

        {/* Knowledge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <KnowledgeCard key={item.id} knowledge={item} username={username} />
          ))}
        </div>

        {/* Empty State */}
        {totalItems === 0 && (
          <Card className="text-center py-12">
            <CardBody>
              <div className="text-default-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No knowledge items yet
              </h3>
              <p className="text-default-500">
                {username} hasn't created any knowledge items yet.
              </p>
            </CardBody>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              {page > 1 && (
                <Button
                  as={Link}
                  href={`?page=${page - 1}&pageSize=${pageSize}`}
                  variant="light"
                  size="sm"
                  radius="md"
                >
                  Previous
                </Button>
              )}

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const maxVisiblePages = 5;
                  const startPage = Math.max(
                    1,
                    page - Math.floor(maxVisiblePages / 2),
                  );
                  const endPage = Math.min(
                    totalPages,
                    startPage + maxVisiblePages - 1,
                  );
                  const adjustedStartPage = Math.max(
                    1,
                    endPage - maxVisiblePages + 1,
                  );

                  const pages = [];

                  // Add first page and ellipsis if needed
                  if (adjustedStartPage > 1) {
                    pages.push(
                      <Button
                        key={1}
                        as={Link}
                        href={`?page=1&pageSize=${pageSize}`}
                        variant={1 === page ? "solid" : "light"}
                        size="sm"
                        radius="md"
                        isIconOnly
                      >
                        1
                      </Button>,
                    );
                    if (adjustedStartPage > 2) {
                      pages.push(
                        <span key="ellipsis1" className="px-2">
                          ...
                        </span>,
                      );
                    }
                  }

                  // Add visible page numbers
                  for (let p = adjustedStartPage; p <= endPage; p++) {
                    pages.push(
                      <Button
                        key={p}
                        as={Link}
                        href={`?page=${p}&pageSize=${pageSize}`}
                        variant={p === page ? "solid" : "light"}
                        size="sm"
                        radius="md"
                        isIconOnly
                      >
                        {p}
                      </Button>,
                    );
                  }

                  // Add ellipsis and last page if needed
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="ellipsis2" className="px-2">
                          ...
                        </span>,
                      );
                    }
                    pages.push(
                      <Button
                        key={totalPages}
                        as={Link}
                        href={`?page=${totalPages}&pageSize=${pageSize}`}
                        variant={totalPages === page ? "solid" : "light"}
                        size="sm"
                        radius="md"
                        isIconOnly
                      >
                        {totalPages}
                      </Button>,
                    );
                  }

                  return pages;
                })()}
              </div>

              {/* Next Button */}
              {page < totalPages && (
                <Button
                  as={Link}
                  href={`?page=${page + 1}&pageSize=${pageSize}`}
                  variant="light"
                  size="sm"
                  radius="md"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
