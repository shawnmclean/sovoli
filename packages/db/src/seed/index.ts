import { db, schema, sql } from "../";
import { UserType } from "../schema";

const books: (typeof schema.Book.$inferInsert)[] = [
  {
    id: "c1108c8d-43e6-43cf-b5a1-e3a3009a80b1",
    title: "The Power of Habit",
    description: "A book about habits",
    isbn13: "9780141036145",
  },
  {
    id: "20aae27b-12df-4651-8f07-bef4c6e80a4e",
    title: "The 7 Habits of Highly Effective People",
    description: "A book about habits",
    isbn13: "9780307358839",
  },
  {
    id: "42e3a018-45d7-44d8-88b9-a0a80d7e2c50",
    title: "The Art of War",
    description: "A book about war",
    isbn13: "9780439136365",
  },
  {
    id: "1f1fe6e2-df13-42e1-8e79-83a74f2fb811",
    title: "The Stress of Life",
    description: "A book about stress",
    isbn13: "1235456789122",
  },
];

const users: (typeof schema.User.$inferInsert)[] = [
  {
    id: "2b3f6532-7053-4415-981e-9bde21b6dd9f",
    name: "John Doe",
    username: "johndoe",
    email: "john@doe.com",
    type: UserType.Human,
  },
  {
    id: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
    name: "ChatGPT",
    username: "chatgpt",
    email: "jane@doe.com",
    type: UserType.Bot,
  },
];

const knowledgeResources: (typeof schema.KnowledgeResource.$inferInsert)[] = [
  {
    id: "dde7b8d8-d8ed-41e5-853e-02a3d26f3521",
    name: "The Stress of Life",
    description: "Stress of life book",
    bookId: "1f1fe6e2-df13-42e1-8e79-83a74f2fb811",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
  },
];

const seedUsers = async () => {
  await db
    .insert(schema.User)
    .values(users)
    .onConflictDoUpdate({
      target: schema.User.id,
      set: {
        name: sql.raw(`excluded.${schema.User.name.name}`),
      },
    });

  const createdUsers = await db.query.User.findMany();
  console.log(JSON.stringify(createdUsers, null, 2));
  console.log("🧨 Done seeding the users table successfully...\n");
};

const seedBooks = async () => {
  await db
    .insert(schema.Book)
    .values(books)
    .onConflictDoUpdate({
      target: schema.Book.id,
      set: {
        title: sql.raw(`excluded.${schema.Book.title.name}`),
        description: sql.raw(`excluded.${schema.Book.description.name}`),
      },
    });
  const createdBooks = await db.query.Book.findMany();
  console.log(JSON.stringify(createdBooks, null, 2));
  console.log("🧨 Done seeding the books table successfully...\n");
};

const seedKnowledgeResources = async () => {
  await db
    .insert(schema.KnowledgeResource)
    .values(knowledgeResources)
    .onConflictDoUpdate({
      target: schema.KnowledgeResource.id,
      set: {
        name: sql.raw(`excluded.${schema.KnowledgeResource.name.name}`),
        description: sql.raw(
          `excluded.${schema.KnowledgeResource.description.name}`,
        ),
      },
    });

  const createdKnowledgeResources = await db.query.KnowledgeResource.findMany();
  console.log(JSON.stringify(createdKnowledgeResources, null, 2));
  console.log(
    "🧨 Done seeding the knowledge resources table successfully...\n",
  );
};

const main = async () => {
  console.log("🧨 Started seeding the database...\n");
  await seedBooks();
  await seedUsers();
  await seedKnowledgeResources();
  // await seedInferredBooks();
  console.log("\n🧨 Done seeding the database successfully...\n");
};

await main();
