/** @jsxImportSource react */

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/jYrzfYCANPI
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Component() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="flex flex-col items-center">
          <img
            src="/placeholder.svg"
            alt="Book Cover"
            width={300}
            height={450}
            className="rounded-lg shadow-lg"
          />
          <h1 className="text-2xl font-bold mt-4">The Alchemist</h1>
          <p className="text-muted-foreground">by Paulo Coelho</p>
        </div>
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold">My Thoughts</h2>
            <p className="text-muted-foreground mt-2">
              I first read The Alchemist a few years ago and it has become one
              of my all-time favorite books. The story of Santiago's journey to
              find his personal legend is both inspiring and thought- provoking.
              Coelho's writing is beautiful and poetic, and the book is full of
              profound insights about life, dreams, and following your heart.
            </p>
            <p className="text-muted-foreground mt-4">
              One of the things I love most about this book is how it encourages
              the reader to embrace the unknown and trust the journey.
              Santiago's willingness to take risks and face his fears is
              something I aspire to in my own life. The book has also helped me
              to appreciate the importance of being present and paying attention
              to the signs and omens that the universe sends our way.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold">My Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <img
                src="/placeholder.svg"
                alt="Photo 1"
                width={200}
                height={150}
                className="rounded-lg shadow-lg"
              />
              <img
                src="/placeholder.svg"
                alt="Photo 2"
                width={200}
                height={150}
                className="rounded-lg shadow-lg"
              />
              <img
                src="/placeholder.svg"
                alt="Photo 3"
                width={200}
                height={150}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">Book Description</h2>
            <p className="text-muted-foreground mt-2">
              The Alchemist follows the journey of a young shepherd named
              Santiago who travels from his home in Spain to the Egyptian desert
              in search of a treasure buried near the Pyramids. Along the way,
              he meets a Gypsy woman, a man who calls himself king, and an
              alchemist, all of whom point Santiago in the direction of his
              quest. No one knows what the treasure is, or if Santiago will be
              able to surmount the obstacles in his path. But what starts out as
              a journey to find worldly goods turns into a discovery of the
              treasures found within.
            </p>
            <p className="text-muted-foreground mt-4">
              The Alchemist is a transformative novel about the essential wisdom
              of listening to our hearts, recognizing opportunity, and following
              our dreams. It is a story about the journey of self- discovery and
              the profound lessons we can learn from the world around us.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold">About the Author</h2>
            <div className="flex items-center gap-4 mt-4">
              <img
                src="/placeholder.svg"
                alt="Author Photo"
                width={100}
                height={100}
                className="rounded-full"
              />
              <div>
                <h3 className="font-bold">Paulo Coelho</h3>
                <p className="text-muted-foreground">
                  Paulo Coelho is a Brazilian lyricist and novelist. He is best
                  known for his novel The Alchemist.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
