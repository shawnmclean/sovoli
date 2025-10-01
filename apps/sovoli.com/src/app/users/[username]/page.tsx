import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import {
  GetUserKnowledgeByUsernameQuery,
  GetUserKnowledgeByUsernameQueryHandler,
} from "~/modules/notes/services/GetUserKnowledgeByUsername";
import { KnowledgeCard } from "./components/KnowledgeCard";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    page: string | undefined;
    pageSize: string | undefined;
  }>;
}

export default async function UserPage({
  params,
  searchParams,
}: UserPageProps) {
  const { username } = await params;
  const searchParamsResolved = await searchParams;

  const page = parseInt(searchParamsResolved.page ?? "1");
  const pageSize = parseInt(searchParamsResolved.pageSize ?? "10");

  // Get user's knowledge items
  const userKnowledgeHandler = new GetUserKnowledgeByUsernameQueryHandler();
  const result = await userKnowledgeHandler.handle(
    new GetUserKnowledgeByUsernameQuery(username),
  );

  if (!result.userKnowledge) {
    notFound();
  }

  const { knowledgeItems } = result.userKnowledge;

  // Calculate pagination
  const totalItems = knowledgeItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = knowledgeItems.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {username}'s Knowledge
          </h1>
          <p className="mt-2 text-default-600">{totalItems} knowledge items</p>
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
            <ul className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <li key={p}>
                  <Button
                    as={Link}
                    href={`?page=${p}&pageSize=${pageSize}`}
                    variant={p === page ? "solid" : "light"}
                    size="sm"
                    radius="md"
                    isIconOnly
                  >
                    {p}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
