import { db, eq, schema, sql } from "../";
import { shelves } from "../schema";

const books: (typeof schema.books.$inferInsert)[] = [
  {
    title: "The Power of Habit",
    description: "A book about habits",
    isbn: "9780141036145",
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
            ],
          },
          {
            name: "Wardrobe Bottom Left Shelf",
            description: "The Psychology and Self-Help Shelf",
            slug: "wardrobe-bottom-left-shelf",
            books: [],
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
            ownerId: user?.id,
          })
          .onConflictDoUpdate({
            target: [schema.furnitures.slug, schema.furnitures.ownerId],
            set: {
              name: sql.raw(`excluded.${schema.furnitures.name.name}`),
              description: sql.raw(
                `excluded.${schema.furnitures.description.name}`
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
                ownerId: user?.id,
              })
              .onConflictDoUpdate({
                target: [schema.shelves.slug, schema.shelves.ownerId],
                set: {
                  name: sql.raw(`excluded.${schema.shelves.name.name}`),
                  description: sql.raw(
                    `excluded.${schema.shelves.description.name}`
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

              const [myBooks] = await db
                .insert(schema.myBooks)
                .values({
                  name,
                  slug,
                  description,
                  ownerId: user?.id,
                  shelfId: shelf.id,
                  shelfOrder: order,
                  bookId: book?.id,
                })
                .onConflictDoUpdate({
                  target: [schema.myBooks.slug, schema.myBooks.ownerId],
                  set: {
                    name: sql.raw(`excluded.${schema.myBooks.name.name}`),
                    description: sql.raw(
                      `excluded.${schema.myBooks.description.name}`
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
    const [book] = await db
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

const main = async () => {
  console.log("🧨 Started seeding the database...\n");
  await seedBooks();
  await seedUsers();
  console.log("\n🧨 Done seeding the database successfully...\n");
};

main();
