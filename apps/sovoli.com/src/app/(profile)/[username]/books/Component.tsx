/** @jsxImportSource react */

import Link from "next/link";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XNxWCxaTvmb
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Component() {
  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Fiction",
      shelf: "Classics",
      isbn: "978-0-7432-7356-5",
      cover: "/placeholder.svg",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Fiction",
      shelf: "Classics",
      isbn: "978-0-446-31078-9",
      cover: "/placeholder.svg",
    },
    {
      id: 3,
      title: "The Alchemist",
      author: "Paulo Coelho",
      category: "Fiction",
      shelf: "Self-Help",
      isbn: "978-0-06-112416-6",
      cover: "/placeholder.svg",
    },
    {
      id: 4,
      title: "Atomic Habits",
      author: "James Clear",
      category: "Non-Fiction",
      shelf: "Self-Help",
      isbn: "978-0-7352-6110-5",
      cover: "/placeholder.svg",
    },
    {
      id: 5,
      title: "The Lean Startup",
      author: "Eric Ries",
      category: "Business",
      shelf: "Entrepreneurship",
      isbn: "978-0-307-88789-4",
      cover: "/placeholder.svg",
    },
    {
      id: 6,
      title: "The Martian",
      author: "Andy Weir",
      category: "Science Fiction",
      shelf: "Fiction",
      isbn: "978-0-8041-3902-1",
      cover: "/placeholder.svg",
    },
  ];
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">My Book Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {books.map((book) => (
          <Link
            href={`/shawn/books/${slugify(book.title)}/${book.isbn}`}
            key={book.id}
          >
            <div
              key={book.id}
              className="bg-background rounded-lg shadow-lg overflow-hidden"
            >
              <div className="aspect-[3/4] relative">
                <img
                  src="/placeholder.svg"
                  alt={book.title}
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                  {book.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{book.title}</h3>
                <p className="text-muted-foreground mb-4">{book.author}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BookIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{book.shelf}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarcodeIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{book.isbn}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function BarcodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 5v14" />
      <path d="M8 5v14" />
      <path d="M12 5v14" />
      <path d="M17 5v14" />
      <path d="M21 5v14" />
    </svg>
  );
}

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
