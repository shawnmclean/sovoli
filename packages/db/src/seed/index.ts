import { db, schema, sql } from "../";
import { KnowledgeType, MediaAssetHost, UserType } from "../schema";

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
  {
    id: "c5996f1d-18e4-4dcd-9444-349a59160973",
    title: "Harry Potter and the Philosopher's Stone",
    description: "A book about Harry Potter",
    isbn13: "1238I21398",
  },
];

const users: (typeof schema.User.$inferInsert)[] = [
  {
    id: "192914a3-fa51-4df7-ab6e-7a1d622c49dd",
    name: "Shawn",
    username: "shawn",
    email: "shawn@sovoli.com",
    type: UserType.Human,
  },
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
    email: "hi@sovoli.com",
    type: UserType.Bot,
  },
];

const knowledges: (typeof schema.Knowledge.$inferInsert)[] = [
  {
    id: "dde7b8d8-d8ed-41e5-853e-02a3d26f3521",
    title: "The Stress of Life",
    description: "Stress of life book added by ChatGPT",
    bookId: "1f1fe6e2-df13-42e1-8e79-83a74f2fb811",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
    type: KnowledgeType.Book,
    slug: "the-stress-of-life",
  },
  {
    id: "db2cbda9-032e-494e-83b2-6f0bb6dd0f86",
    title: "The Power of Habit",
    description: "Power of habit book added by ChatGPT",
    bookId: "c1108c8d-43e6-43cf-b5a1-e3a3009a80b1",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
    type: KnowledgeType.Book,
    slug: "the-power-of-habit",
  },
  {
    id: "e20976f2-58f4-4428-bd5a-5777d4f8f277",
    title: "Harry Potter and the Philosopher's Stone",
    description: "Harry Potter book added by ChatGPT",
    bookId: "c5996f1d-18e4-4dcd-9444-349a59160973",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
    type: KnowledgeType.Book,
    slug: "harry-potter-and-the-philosophers-stone",
  },
  {
    id: "cd281ef5-4ebc-4af2-bcdd-80e732529a7b",
    title: "Just a note about psychology",
    description: "Pain and simple note",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
    isOrigin: true,
    type: KnowledgeType.Note,
    slug: "just-a-note-about-psychology",
  },
  // collections

  {
    id: "85cf848e-09ca-45b4-96a0-73f38cf48afd",
    title: "Owned",
    description: "All the books ChatGPT owns",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
    isPrivate: false,
    isOrigin: true,
    slug: "owned",
    type: KnowledgeType.Collection,
  },
  {
    id: "a9d2fc8d-d5d0-454c-848a-6a91d8a432b9",
    title: "Psychology Shelf",
    description: "All the books ChatGPT reads about psychology",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
    isPrivate: false,
    isOrigin: true,
    slug: "psychology-shelf",
    type: KnowledgeType.Collection,
  },
  {
    id: "cc9cf8b2-42ea-4e27-9a31-7b50ab4dace4",
    title: "Owned",
    description: "All the books John Doe owns",
    userId: "2b3f6532-7053-4415-981e-9bde21b6dd9f",
    isPrivate: false,
    isOrigin: true,
    slug: "owned",
    type: KnowledgeType.Collection,
  },
  {
    id: "1297a14b-f942-4532-be54-4b6e542ca04c",
    title: "Privatre Collection",
    description: "John Doe's private collection",
    userId: "2b3f6532-7053-4415-981e-9bde21b6dd9f",
    isPrivate: true,
    isOrigin: true,
    slug: "private-collection",
    type: KnowledgeType.Collection,
  },
  // Shawn's collection
  {
    id: "fa822f2f-f11a-4a76-a2e1-199170d5b50c",
    title: "Shawn's Collection",
    description: "Shawn's collection",
    userId: "192914a3-fa51-4df7-ab6e-7a1d622c49dd",
    isPrivate: false,
    isOrigin: true,
    slug: "shawn-collection",
    type: KnowledgeType.Collection,
  },
  {
    id: "efab5eab-4f0f-4545-a6ca-10aae137f6ba",
    title: "Shawn's Private Collection",
    description: "Shawn's private collection",
    userId: "192914a3-fa51-4df7-ab6e-7a1d622c49dd",
    isPrivate: true,
    isOrigin: true,
    slug: "shawn-private-collection",
    type: KnowledgeType.Collection,
  },
  {
    id: "dcdd76fd-0f1c-45db-acda-fce13f90c69b",
    title: "Shawn's Public Collection With Private Collection",
    description: "Shawn's Public Collection With Private Collection",
    userId: "192914a3-fa51-4df7-ab6e-7a1d622c49dd",
    isPrivate: false,
    slug: "shawn-public-collection-with-private-collection",
    type: KnowledgeType.Collection,
  },
];

const knowledgeConnections: (typeof schema.KnowledgeConnection.$inferInsert)[] =
  [
    {
      id: "00c9c48b-3c7c-4552-aec3-29694d7565ae",
      sourceKnowledgeId: "85cf848e-09ca-45b4-96a0-73f38cf48afd",
      targetKnowledgeId: "dde7b8d8-d8ed-41e5-853e-02a3d26f3521",
      notes:
        "This is a note about the book stress of life for ChatGPT on owned",
    },
    {
      id: "697032a6-f874-4747-b2f1-c050f8872446",
      sourceKnowledgeId: "85cf848e-09ca-45b4-96a0-73f38cf48afd",
      targetKnowledgeId: "db2cbda9-032e-494e-83b2-6f0bb6dd0f86",
      notes:
        "This is a note about the power of habit book for ChatGPT in owned",
    },
    {
      id: "a75bf6ab-2c55-4f3e-a45e-5db8bb4fb586",
      sourceKnowledgeId: "85cf848e-09ca-45b4-96a0-73f38cf48afd",
      targetKnowledgeId: "e20976f2-58f4-4428-bd5a-5777d4f8f277",
      notes: "This is a note about the Harry Potter book for ChatGPT in owned",
    },
    // the psychology shelf for ChatGPT
    {
      id: "7c8dc146-1170-4acb-a771-85d9f12f096e",
      sourceKnowledgeId: "a9d2fc8d-d5d0-454c-848a-6a91d8a432b9",
      targetKnowledgeId: "dde7b8d8-d8ed-41e5-853e-02a3d26f3521",
      notes:
        "This is a note about the book stress of life for ChatGPT on psychology shelf",
    },
    {
      id: "45f29c6b-3469-4310-b381-a7027211b456",
      sourceKnowledgeId: "a9d2fc8d-d5d0-454c-848a-6a91d8a432b9",
      targetKnowledgeId: "db2cbda9-032e-494e-83b2-6f0bb6dd0f86",
      notes:
        "This is a note about the power of habit book for ChatGPT on psychology shelf",
    },
    {
      id: "bb801c78-3657-4bef-ad12-3a8f0eadb735",
      sourceKnowledgeId: "a9d2fc8d-d5d0-454c-848a-6a91d8a432b9",
      notes: "This is just a note",
      targetKnowledgeId: "cd281ef5-4ebc-4af2-bcdd-80e732529a7b",
    },
    // shawn's public collection with private collection
    {
      id: "59c55a8d-7437-45c0-ab66-b09045046199",
      sourceKnowledgeId: "dcdd76fd-0f1c-45db-acda-fce13f90c69b",
      targetKnowledgeId: "efab5eab-4f0f-4545-a6ca-10aae137f6ba",
      notes:
        "This  is a private connection between shawn's public collection and shawn's private collection",
    },
  ];

const mediaAssets: (typeof schema.MediaAsset.$inferInsert)[] = [
  {
    id: "25192f66-bbbb-4aa6-9016-ceacb4786379",
    knowledgeId: "85cf848e-09ca-45b4-96a0-73f38cf48afd",
    host: MediaAssetHost.Supabase,
    bucket: "collection-images",
    path: "collection-images/0c274f47-ace1-49b1-8005-bdb8cab523ce.jpg",
  },
  {
    id: "63375850-63e4-4c5b-92d1-f7f02e561bca",
    knowledgeId: "dde7b8d8-d8ed-41e5-853e-02a3d26f3521",
    host: MediaAssetHost.Supabase,
    bucket: "collection-images",
    path: "collection-images/63375850-63e4-4c5b-92d1-f7f02e561bca.jpg",
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

const seedKnowledges = async () => {
  await db
    .insert(schema.Knowledge)
    .values(knowledges)
    .onConflictDoUpdate({
      target: schema.Knowledge.id,
      set: {
        title: sql.raw(`excluded.${schema.Knowledge.title.name}`),
        description: sql.raw(`excluded.${schema.Knowledge.description.name}`),
        content: sql.raw(`excluded.${schema.Knowledge.content.name}`),
        context: sql.raw(`excluded.${schema.Knowledge.context.name}`),
        contextDescription: sql.raw(
          `excluded.${schema.Knowledge.contextDescription.name}`,
        ),
        isOrigin: sql.raw(`excluded.${schema.Knowledge.isOrigin.name}`),
        userId: sql.raw(`excluded.${schema.Knowledge.userId.name}`),
        bookId: sql.raw(`excluded.${schema.Knowledge.bookId.name}`),
        type: sql.raw(`excluded.${schema.Knowledge.type.name}`),
        slug: sql.raw(`excluded.${schema.Knowledge.slug.name}`),
        isPrivate: sql.raw(`excluded.${schema.Knowledge.isPrivate.name}`),
        chapterNumber: sql.raw(
          `excluded.${schema.Knowledge.chapterNumber.name}`,
        ),
      },
    });

  const createdKnowledgeResources = await db.query.Knowledge.findMany();
  console.log(JSON.stringify(createdKnowledgeResources, null, 2));
  console.log(
    "🧨 Done seeding the knowledge resources table successfully...\n",
  );
};
const seedKnowledgeConnections = async () => {
  await db
    .insert(schema.KnowledgeConnection)
    .values(knowledgeConnections)
    .onConflictDoUpdate({
      target: schema.KnowledgeConnection.id,
      set: {
        targetKnowledgeId: sql.raw(
          `excluded.${schema.KnowledgeConnection.targetKnowledgeId.name}`,
        ),
        sourceKnowledgeId: sql.raw(
          `excluded.${schema.KnowledgeConnection.sourceKnowledgeId.name}`,
        ),
        notes: sql.raw(`excluded.${schema.KnowledgeConnection.notes.name}`),
        order: sql.raw(`excluded.${schema.KnowledgeConnection.order.name}`),
      },
    });

  const createdKnowledgeConnections =
    await db.query.KnowledgeConnection.findMany();
  console.log(JSON.stringify(createdKnowledgeConnections, null, 2));
  console.log(
    "🧨 Done seeding the createdKnowledgeConnections items table successfully...\n",
  );
};

const seedMediaAssets = async () => {
  await db
    .insert(schema.MediaAsset)
    .values(mediaAssets)
    .onConflictDoUpdate({
      target: schema.MediaAsset.id,
      set: {
        host: sql.raw(`excluded.${schema.MediaAsset.host.name}`),
        bucket: sql.raw(`excluded.${schema.MediaAsset.bucket.name}`),
        path: sql.raw(`excluded.${schema.MediaAsset.path.name}`),
      },
    });

  const createdMediaAssets = await db.query.MediaAsset.findMany();
  console.log(JSON.stringify(createdMediaAssets, null, 2));
  console.log("🧨 Done seeding the media assets table successfully...\n");
};

const main = async () => {
  console.log("🧨 Started seeding the database...\n");
  await seedBooks();
  await seedUsers();
  await seedKnowledges();
  await seedMediaAssets();
  await seedKnowledgeConnections();

  console.log("\n🧨 Done seeding the database successfully...\n");
};

await main();
