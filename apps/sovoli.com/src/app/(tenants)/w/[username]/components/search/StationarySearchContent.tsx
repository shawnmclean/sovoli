"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { SearchIcon } from "lucide-react";

interface StationarySearchContentProps {
  onSearchStart?: () => void;
  onSearchComplete?: (resultsFound: number) => void;
  source?: "landing_page" | "mobile_drawer" | "search_page";
}

export function StationarySearchContent({
  onSearchStart,
  onSearchComplete,
  source = "landing_page",
}: StationarySearchContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    onSearchStart?.();
    setIsLoading(true);

    try {
      // TODO: Implement stationary organization search logic
      // This would search for services, products, or other offerings
      // based on the search query

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just complete with mock results
      onSearchComplete?.(0);
    } catch (error) {
      console.error("Error searching stationary services:", error);
      onSearchComplete?.(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mb-18">
      <h1 className="text-2xl font-bold text-foreground mb-1">
        Find What You Need
      </h1>
      <div className="flex flex-col gap-4 my-2">
        <div>
          <h2 className="text-default-600 font-medium mb-2">
            Search for services or products
          </h2>
          <div className="flex gap-2">
            <Input
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isLoading}
              startContent={<SearchIcon size={16} />}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="mt-4 p-3 bg-primary-50 text-primary-900 rounded-lg text-sm">
              Searching for services...
            </div>
          )}

          {/* TODO: Add results display when search is implemented */}
        </div>
      </div>
    </div>
  );
}
