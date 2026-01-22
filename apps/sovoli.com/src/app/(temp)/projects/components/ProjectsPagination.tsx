"use client";

import { Link } from "@sovoli/ui/components/link";
import { usePathname, useSearchParams } from "next/navigation";

interface ProjectsPaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  selectedOrg?: string;
}

export function ProjectsPagination({
  page,
  pageSize,
  totalPages,
  selectedOrg,
}: ProjectsPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildHref = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNum.toString());
    params.set("pageSize", pageSize.toString());
    // Preserve view param if it exists
    const view = searchParams.get("view");
    if (view) {
      params.set("view", view);
    }
    if (selectedOrg) {
      params.set("org", selectedOrg);
    }
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mt-8 flex justify-center">
      <nav className="flex items-center gap-2" aria-label="Pagination">
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          const isActive = pageNum === page;
          const href = buildHref(pageNum);
          return (
            <Link
              key={pageNum}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`px-3 py-1 rounded-md border text-sm font-medium ${
                isActive
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-default-700 border-default-200 hover:bg-default-100"
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
