"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { ITEM_CATEGORY_TREE } from "~/modules/data/items/categories/index";
import type { CategoryDefinition } from "~/modules/core/items/types";

function getCategoryDepth(category: CategoryDefinition): number {
  if (!category.children || category.children.length === 0) {
    return 0;
  }
  return 1 + Math.max(...category.children.map(getCategoryDepth));
}

function countTotalItems(category: CategoryDefinition): number {
  if (!category.children || category.children.length === 0) {
    return 1; // This is a leaf node (product type)
  }
  return category.children.reduce(
    (sum, child) => sum + countTotalItems(child),
    0,
  );
}

interface DepartmentCardProps {
  department: CategoryDefinition;
  onClick: () => void;
  onCategoryClick: (category: CategoryDefinition) => void;
}

function DepartmentCard({
  department,
  onClick,
  onCategoryClick,
}: DepartmentCardProps) {
  const depth = getCategoryDepth(department);
  const totalItems = countTotalItems(department);
  const categories = department.children ?? [];

  return (
    <Card className="h-full transition-all hover:shadow-lg">
      <CardHeader className="flex-col items-start gap-2 pb-2">
        <div
          className="w-full cursor-pointer"
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <h3 className="text-lg font-semibold hover:text-primary">
            {department.name}
          </h3>
          {department.gpcCode && (
            <p className="text-xs text-default-500">
              GPC: {department.gpcCode}
            </p>
          )}
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-sm text-default-600">
            <p>{categories.length} categories</p>
            <p>{totalItems} product types</p>
            <p className="text-xs text-default-400">
              {depth} level{depth !== 1 ? "s" : ""} deep
            </p>
          </div>
          {categories.length > 0 && (
            <div className="border-t border-default-200 pt-3">
              <h4 className="text-xs font-semibold text-default-500 mb-2 uppercase tracking-wide">
                Categories
              </h4>
              <ul className="flex flex-col gap-1.5">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCategoryClick(category);
                      }}
                      className="w-full text-left text-sm text-default-700 hover:text-primary hover:underline transition-colors"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

interface CategoryGridProps {
  categories: CategoryDefinition[];
  onCategoryClick: (category: CategoryDefinition) => void;
}

function CategoryGrid({ categories, onCategoryClick }: CategoryGridProps) {
  if (categories.length === 0) {
    return null;
  }

  const firstCategory = categories[0];
  if (!firstCategory) {
    return null;
  }

  const isProductType =
    !firstCategory.children || firstCategory.children.length === 0;

  if (isProductType) {
    // Display as a simple list for product types
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-lg border border-default-200 p-4 transition-colors hover:border-default-400 hover:bg-default-50 dark:hover:bg-default-100"
          >
            <h4 className="font-medium">{category.name}</h4>
            {category.gpcCode && (
              <p className="text-xs text-default-500 mt-1">
                GPC: {category.gpcCode}
              </p>
            )}
            {category.gpcDescription && (
              <p className="text-sm text-default-600 mt-2">
                {category.gpcDescription}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category) => {
        const childCount = category.children?.length ?? 0;
        const totalItems = countTotalItems(category);

        return (
          <Card
            key={category.id}
            isPressable
            onPress={() => onCategoryClick(category)}
            className="h-full transition-all hover:scale-105 hover:shadow-lg"
          >
            <CardHeader className="flex-col items-start gap-2 pb-2">
              <h4 className="font-semibold">{category.name}</h4>
              {category.gpcCode && (
                <p className="text-xs text-default-500">
                  GPC: {category.gpcCode}
                </p>
              )}
            </CardHeader>
            <CardBody className="pt-0">
              <div className="flex flex-col gap-1 text-sm text-default-600">
                {childCount > 0 && (
                  <p>
                    {childCount} subcategor{childCount !== 1 ? "ies" : "y"}
                  </p>
                )}
                <p>
                  {totalItems} product type{totalItems !== 1 ? "s" : ""}
                </p>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

interface BreadcrumbProps {
  path: CategoryDefinition[];
  onNavigate: (index: number) => void;
}

function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  if (path.length === 0) {
    return null;
  }

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm">
      <Link
        onPress={() => onNavigate(-1)}
        className="text-default-600 hover:text-default-900"
      >
        All Departments
      </Link>
      {path.map((category, index) => (
        <div key={category.id} className="flex items-center gap-2">
          <span className="text-default-400">/</span>
          {index === path.length - 1 ? (
            <span className="font-semibold text-default-900">
              {category.name}
            </span>
          ) : (
            <Link
              onPress={() => onNavigate(index)}
              className="text-default-600 hover:text-default-900"
            >
              {category.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function DepartmentsPage() {
  const [navigationPath, setNavigationPath] = useState<CategoryDefinition[]>(
    [],
  );

  const currentCategories =
    navigationPath.length === 0
      ? ITEM_CATEGORY_TREE
      : (navigationPath[navigationPath.length - 1]?.children ?? []);

  const handleCategoryClick = (category: CategoryDefinition) => {
    if (category.children && category.children.length > 0) {
      setNavigationPath([...navigationPath, category]);
    }
  };

  const handleNavigate = (index: number) => {
    if (index === -1) {
      setNavigationPath([]);
    } else {
      setNavigationPath(navigationPath.slice(0, index + 1));
    }
  };

  const currentTitle =
    navigationPath.length === 0
      ? "All Departments"
      : (navigationPath[navigationPath.length - 1]?.name ?? "Unknown");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{currentTitle}</h1>
        <p className="text-default-600">
          {navigationPath.length === 0
            ? "Browse our product categories"
            : `Browse ${currentTitle.toLowerCase()}`}
        </p>
      </div>

      <Breadcrumb path={navigationPath} onNavigate={handleNavigate} />

      {navigationPath.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ITEM_CATEGORY_TREE.map((department: CategoryDefinition) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onClick={() => handleCategoryClick(department)}
              onCategoryClick={handleCategoryClick}
            />
          ))}
        </div>
      ) : (
        <CategoryGrid
          categories={currentCategories}
          onCategoryClick={handleCategoryClick}
        />
      )}
    </div>
  );
}
