"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/BXXcq3LLLwV
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import Categories from "./Categories";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

export default function Component() {
  return (
    <div className="p-4 space-y-8">
      <Categories />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Books</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Input placeholder="Search books..." className="w-full" />
          <Button>Search</Button>
          {/* <Select>
            <SelectTrigger aria-label="Type">
              <SelectValue placeholder="Type: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="fiction">Fiction</SelectItem>
              <SelectItem value="non-fiction">Non-Fiction</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger aria-label="Language">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger aria-label="Sort by">
              <SelectValue placeholder="Sort by: Recently added" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recently-added">Recently added</SelectItem>
              <SelectItem value="most-popular">Most popular</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Book Title 1</h3>
                <p className="text-muted-foreground">Author 1</p>
              </div>
              <Button variant="outline">Starred</Button>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-muted-foreground">Updated last week</span>
              <span className="text-muted-foreground">60,206 views</span>
              <span className="text-muted-foreground">6,201 stars</span>
            </div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Book Title 2</h3>
                <p className="text-muted-foreground">Author 2</p>
              </div>
              <Button variant="outline">Starred</Button>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-muted-foreground">Updated May 16</span>
              <span className="text-muted-foreground">45,231 views</span>
              <span className="text-muted-foreground">5,201 stars</span>
            </div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Book Title 3</h3>
                <p className="text-muted-foreground">Author 3</p>
              </div>
              <Button variant="outline">Starred</Button>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-muted-foreground">
                Updated 15 hours ago
              </span>
              <span className="text-muted-foreground">35,206 views</span>
              <span className="text-muted-foreground">3,201 stars</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
