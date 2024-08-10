import { db, eq, schema, sql } from "../";

const books: (typeof schema.books.$inferInsert)[] = [
  {
    title: "The Power of Habit",
    description: "A book about habits",
    isbn: "9780141036145",
  },
  {
    title: "The 7 Habits of Highly Effective People",
    description: "A book about habits",
    isbn: "9780307358839",
  },
  {
    title: "The Art of War",
    description: "A book about war",
    isbn: "9780439136365",
  },
  {
    title: "Titanic",
    description: "A book about the Titanic",
    isbn: "9780439136365",
  },
];

const data = [
  {
    name: "John Doe",
    username: "johndoe",
    furnitures: [
      {
        name: "Wardrobe",
        slug: "wardrobe",
        description:
          "A wardrobe with drawers for clothes and shelves for books",
        shelves: [
          {
            name: "Wardrobe Top Left Shelf",
            description: "The Commmunication and Social Intelligence Shelf",
            slug: "wardrobe-top-left-shelf",
            books: [
              {
                name: "The Power of Habit",
                slug: "the-power-of-habit",
                description: "A book about habits",
                order: 0,
              },
              {
                name: "The 7 Habits of Highly Effective People",
                slug: "the-7-habits-of-highly-effective-people",
                description: "A book about habits",
                order: 1,
              },
              {
                name: "The Art of War",
                slug: "the-art-of-war",
                description: "A book about war",
                order: 2,
              },
            ],
          },
          {
            name: "Wardrobe Bottom Left Shelf",
            description: "The Psychology and Self-Help Shelf",
            slug: "wardrobe-bottom-left-shelf",
            books: [
              {
                name: "Titanic",
                slug: "titanic",
                description: "A book about the Titanic",
                order: 0,
              },
            ],
          },
        ],
      },
      {
        name: "Writing Desk",
        slug: "writing-desk",
        description: "A desk with a drawer and shelves",
        shelves: [],
      },
    ],
  },
  {
    name: "Jane Doe",
    username: "janedoe",
    furnitures: [
      {
        name: "Wardrobe",
        slug: "wardrobe",
        description: "Wardrobe for clothes and books",
        shelves: [
          {
            name: "Wardrobe Top Left Shelf",
            slug: "wardrobe-top-left-shelf",
            description: "Shelf for all my books",
            books: [],
          },
        ],
      },
    ],
  },
];

const seedUsers = async () => {
  try {
    for (const { name, username, furnitures } of data) {
      const [user] = await db
        .insert(schema.users)
        .values({
          name,
          username,
        })
        .onConflictDoUpdate({
          target: schema.users.username,
          set: {
            name: sql.raw(`excluded.${schema.users.name.name}`),
          },
        })
        .returning();

      if (!user) break;

      for (const { name, description, slug, shelves } of furnitures) {
        const [furniture] = await db
          .insert(schema.furnitures)
          .values({
            name,
            description,
            slug,
            ownerId: user.id,
          })
          .onConflictDoUpdate({
            target: [schema.furnitures.slug, schema.furnitures.ownerId],
            set: {
              name: sql.raw(`excluded.${schema.furnitures.name.name}`),
              description: sql.raw(
                `excluded.${schema.furnitures.description.name}`,
              ),
            },
          })
          .returning();

        if (!furniture) break;

        for (const { name, description, slug, books } of shelves) {
          {
            const [shelf] = await db
              .insert(schema.shelves)
              .values({
                name,
                description,
                slug,
                furnitureId: furniture.id,
                ownerId: user.id,
              })
              .onConflictDoUpdate({
                target: [schema.shelves.slug, schema.shelves.ownerId],
                set: {
                  name: sql.raw(`excluded.${schema.shelves.name.name}`),
                  description: sql.raw(
                    `excluded.${schema.shelves.description.name}`,
                  ),
                },
              })
              .returning();

            if (!shelf) break;

            for (const { name, slug, description, order } of books) {
              const book = await db.query.books.findFirst({
                where: eq(schema.books.title, name),
              });
              if (!book) break;
              console.log("creating myBooks for book", book);

              await db
                .insert(schema.myBooks)
                .values({
                  name,
                  slug,
                  description,
                  ownerId: user.id,
                  shelfId: shelf.id,
                  shelfOrder: order,
                  bookId: book.id,
                })
                .onConflictDoUpdate({
                  target: [schema.myBooks.slug, schema.myBooks.ownerId],
                  set: {
                    name: sql.raw(`excluded.${schema.myBooks.name.name}`),
                    description: sql.raw(
                      `excluded.${schema.myBooks.description.name}`,
                    ),
                  },
                })
                .returning();
            }
          }
        }
      }
    }

    const users = await db.query.users.findMany({
      with: {
        furnitures: {
          with: {
            shelves: {
              with: {
                books: true,
              },
            },
          },
        },
      },
    });
    console.log(JSON.stringify(users, null, 2));
    console.log("🧨 Done seeding the users table successfully...\n");
  } catch (error) {
    console.error("🚨 Failed to seed users table!");
    console.error(error);
  }
};

const seedBooks = async () => {
  for (const { title, description, isbn } of books) {
    await db
      .insert(schema.books)
      .values({
        title,
        description,
        isbn,
      })
      .onConflictDoUpdate({
        target: schema.books.isbn,
        set: {
          title: sql.raw(`excluded.${schema.books.title.name}`),
          description: sql.raw(`excluded.${schema.books.description.name}`),
        },
      })
      .returning();
  }

  const createdBooks = await db.query.books.findMany();
  console.log(JSON.stringify(createdBooks, null, 2));
  console.log("🧨 Done seeding the books table successfully...\n");
};

const seedInferredBooks = async () => {
  const johnDoe = await db.query.users.findFirst({
    where: eq(schema.users.username, "johndoe"),
  });

  if (!johnDoe) throw new Error("johndoe user not found");

  const result = await db
    .insert(schema.myBooks)
    .values([
      {
        inferredBook: {
          title: "The Power of Habit",
          author: "Charles Duhigg",
          isbn: "9780141036145",
        },
        name: "The Power of Habit",
        ownerId: johnDoe.id,
      },
      {
        inferredBook: {
          title: "The 7 Habits of Highly Effective People",
          author: "Stephen Covey",
          isbn: "9780307358839",
        },
        name: "The 7 Habits of Highly Effective People",
        ownerId: johnDoe.id,
      },
    ])
    .returning({ id: schema.myBooks.id });
  console.log("🧨 Done seeding the inferredBooks table successfully...\n");
  console.log(JSON.stringify(result, null, 2));
};

const main = async () => {
  console.log("🧨 Started seeding the database...\n");
  await seedBooks();
  await seedUsers();
  await seedInferredBooks();
  console.log("\n🧨 Done seeding the database successfully...\n");
};

await main();
