import { db, schema, sql } from "../";
import { UserType } from "../schema";

const books: (typeof schema.Book.$inferInsert)[] = [
  {
    title: "The Power of Habit",
    description: "A book about habits",
    isbn13: "9780141036145",
  },
  {
    title: "The 7 Habits of Highly Effective People",
    description: "A book about habits",
    isbn13: "9780307358839",
  },
  {
    title: "The Art of War",
    description: "A book about war",
    isbn13: "9780439136365",
  },
  {
    title: "Titanic",
    description: "A book about the Titanic",
    isbn13: "9780439136365",
  },
];

const users: (typeof schema.User.$inferInsert)[] = [
  {
    name: "John Doe",
    username: "johndoe",
    email: "john@doe.com",
    type: UserType.Human,
  },
  {
    name: "ChatGPT",
    username: "chatgpt",
    email: "jane@doe.com",
    type: UserType.Bot,
  },
];

const seedUsers = async () => {
  try {
    for (const { name, username, email, type } of users) {
      await db
        .insert(schema.User)
        .values({
          name,
          username,
          email,
          type,
        })
        .onConflictDoUpdate({
          target: schema.User.email,
          set: {
            name: sql.raw(`excluded.${schema.User.name.name}`),
          },
        })
        .returning();
    }

    console.log("🧨 Done seeding the users table successfully...\n");
  } catch (error) {
    console.error("🚨 Failed to seed users table!");
    console.error(error);
  }
};

const seedBooks = async () => {
  for (const { title, description, isbn13 } of books) {
    await db
      .insert(schema.Book)
      .values({
        title,
        description,
        isbn13,
      })
      .onConflictDoUpdate({
        target: schema.Book.isbn13,
        set: {
          title: sql.raw(`excluded.${schema.Book.title.name}`),
          description: sql.raw(`excluded.${schema.Book.description.name}`),
        },
      })
      .returning();
  }

  const createdBooks = await db.query.Book.findMany();
  console.log(JSON.stringify(createdBooks, null, 2));
  console.log("🧨 Done seeding the books table successfully...\n");
};

const main = async () => {
  console.log("🧨 Started seeding the database...\n");
  await seedBooks();
  await seedUsers();
  // await seedInferredBooks();
  console.log("\n🧨 Done seeding the database successfully...\n");
};

await main();
