import { db, schema, sql } from "../";
import { MediaAssetHost, UserType } from "../schema";

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
    email: "jane@doe.com",
    type: UserType.Bot,
  },
];

const knowledgeResources: (typeof schema.KnowledgeResource.$inferInsert)[] = [
  {
    id: "dde7b8d8-d8ed-41e5-853e-02a3d26f3521",
    name: "The Stress of Life",
    description: "Stress of life book added by ChatGPT",
    bookId: "1f1fe6e2-df13-42e1-8e79-83a74f2fb811",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
  },
  {
    id: "db2cbda9-032e-494e-83b2-6f0bb6dd0f86",
    name: "The Power of Habit",
    description: "Power of habit book added by ChatGPT",
    bookId: "c1108c8d-43e6-43cf-b5a1-e3a3009a80b1",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
  },
  {
    id: "e20976f2-58f4-4428-bd5a-5777d4f8f277",
    name: "Harry Potter and the Philosopher's Stone",
    description: "Harry Potter book added by ChatGPT",
    bookId: "c5996f1d-18e4-4dcd-9444-349a59160973",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
  },
  {
    id: "cd281ef5-4ebc-4af2-bcdd-80e732529a7b",
    name: "Just a note about psychology",
    description: "Pain and simple note",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
  },
];

const collections: (typeof schema.Collection.$inferInsert)[] = [
  {
    id: "85cf848e-09ca-45b4-96a0-73f38cf48afd",
    name: "Owned",
    description: "All the books ChatGPT owns",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
    isDefault: true,
    isPrivate: false,
    slug: "owned",
  },
  {
    id: "a9d2fc8d-d5d0-454c-848a-6a91d8a432b9",
    name: "Psychology Shelf",
    description: "All the books ChatGPT reads about psychology",
    userId: "f1a2ab2a-9195-45c1-982e-8b5bc661986c",
    isPrivate: false,
    slug: "psychology-shelf",
  },
  {
    id: "cc9cf8b2-42ea-4e27-9a31-7b50ab4dace4",
    name: "Owned",
    description: "All the books John Doe owns",
    userId: "2b3f6532-7053-4415-981e-9bde21b6dd9f",
    isPrivate: false,
    slug: "owned",
  },
  {
    id: "1297a14b-f942-4532-be54-4b6e542ca04c",
    name: "Privatre Collection",
    description: "John Doe's private collection",
    userId: "2b3f6532-7053-4415-981e-9bde21b6dd9f",
    isPrivate: true,
    slug: "private-collection",
  },
  // Shawn's collection
  {
    id: "fa822f2f-f11a-4a76-a2e1-199170d5b50c",
    name: "Shawn's Collection",
    description: "Shawn's collection",
    userId: "192914a3-fa51-4df7-ab6e-7a1d622c49dd",
    isPrivate: false,
    slug: "shawn-collection",
  },
  {
    id: "efab5eab-4f0f-4545-a6ca-10aae137f6ba",
    name: "Shawn's Private Collection",
    description: "Shawn's private collection",
    userId: "192914a3-fa51-4df7-ab6e-7a1d622c49dd",
    isPrivate: true,
    slug: "shawn-private-collection",
  },
];

const collectionItems: (typeof schema.CollectionItem.$inferInsert)[] = [
  {
    id: "00c9c48b-3c7c-4552-aec3-29694d7565ae",
    collectionId: "85cf848e-09ca-45b4-96a0-73f38cf48afd",
    knowledgeResourceId: "dde7b8d8-d8ed-41e5-853e-02a3d26f3521",
    notes: "This is a note about the book stress of life for ChatGPT on owned",
  },
  {
    id: "697032a6-f874-4747-b2f1-c050f8872446",
    collectionId: "85cf848e-09ca-45b4-96a0-73f38cf48afd",
    knowledgeResourceId: "db2cbda9-032e-494e-83b2-6f0bb6dd0f86",
    notes: "This is a note about the power of habit book for ChatGPT in owned",
  },
  {
    id: "a75bf6ab-2c55-4f3e-a45e-5db8bb4fb586",
    collectionId: "85cf848e-09ca-45b4-96a0-73f38cf48afd",
    knowledgeResourceId: "e20976f2-58f4-4428-bd5a-5777d4f8f277",
    notes: "This is a note about the Harry Potter book for ChatGPT in owned",
  },
  // the psychology shelf for ChatGPT
  {
    id: "7c8dc146-1170-4acb-a771-85d9f12f096e",
    collectionId: "a9d2fc8d-d5d0-454c-848a-6a91d8a432b9",
    knowledgeResourceId: "dde7b8d8-d8ed-41e5-853e-02a3d26f3521",
    notes:
      "This is a note about the book stress of life for ChatGPT on psychology shelf",
  },
  {
    id: "45f29c6b-3469-4310-b381-a7027211b456",
    collectionId: "a9d2fc8d-d5d0-454c-848a-6a91d8a432b9",
    knowledgeResourceId: "db2cbda9-032e-494e-83b2-6f0bb6dd0f86",
    notes:
      "This is a note about the power of habit book for ChatGPT on psychology shelf",
  },
  {
    id: "bb801c78-3657-4bef-ad12-3a8f0eadb735",
    collectionId: "a9d2fc8d-d5d0-454c-848a-6a91d8a432b9",
    notes: "This is just a note",
    knowledgeResourceId: "cd281ef5-4ebc-4af2-bcdd-80e732529a7b",
  },
];

const mediaAssets: (typeof schema.MediaAsset.$inferInsert)[] = [
  {
    id: "25192f66-bbbb-4aa6-9016-ceacb4786379",
    host: MediaAssetHost.Supabase,
    bucket: "collection-images",
    path: "collection-images/0c274f47-ace1-49b1-8005-bdb8cab523ce.jpg",
  },
];

const collectionMediaAssets: (typeof schema.CollectionMediaAsset.$inferInsert)[] =
  [
    {
      id: "e0c9c48b-3c7c-4552-aec3-29694d7565ae",
      collectionId: "85cf848e-09ca-45b4-96a0-73f38cf48afd",
      mediaAssetId: "25192f66-bbbb-4aa6-9016-ceacb4786379",
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
        userId: sql.raw(`excluded.${schema.KnowledgeResource.userId.name}`),
        bookId: sql.raw(`excluded.${schema.KnowledgeResource.bookId.name}`),
      },
    });

  const createdKnowledgeResources = await db.query.KnowledgeResource.findMany();
  console.log(JSON.stringify(createdKnowledgeResources, null, 2));
  console.log(
    "🧨 Done seeding the knowledge resources table successfully...\n",
  );
};

const seedCollections = async () => {
  await db
    .insert(schema.Collection)
    .values(collections)
    .onConflictDoUpdate({
      target: schema.Collection.id,
      set: {
        name: sql.raw(`excluded.${schema.Collection.name.name}`),
        description: sql.raw(`excluded.${schema.Collection.description.name}`),
        userId: sql.raw(`excluded.${schema.Collection.userId.name}`),
        isDefault: sql.raw(`excluded.${schema.Collection.isDefault.name}`),
        isPrivate: sql.raw(`excluded.${schema.Collection.isPrivate.name}`),
        slug: sql.raw(`excluded.${schema.Collection.slug.name}`),
      },
    });

  const createdCollections = await db.query.Collection.findMany();
  console.log(JSON.stringify(createdCollections, null, 2));
  console.log("🧨 Done seeding the collections table successfully...\n");
};

const seedCollectionItems = async () => {
  await db
    .insert(schema.CollectionItem)
    .values(collectionItems)
    .onConflictDoUpdate({
      target: schema.CollectionItem.id,
      set: {
        collectionId: sql.raw(
          `excluded.${schema.CollectionItem.collectionId.name}`,
        ),
        knowledgeResourceId: sql.raw(
          `excluded.${schema.CollectionItem.knowledgeResourceId.name}`,
        ),
        notes: sql.raw(`excluded.${schema.CollectionItem.notes.name}`),
        order: sql.raw(`excluded.${schema.CollectionItem.order.name}`),
      },
    });

  const createdCollectionItems = await db.query.CollectionItem.findMany();
  console.log(JSON.stringify(createdCollectionItems, null, 2));
  console.log("🧨 Done seeding the collection items table successfully...\n");
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

const seedCollectionMediaAssets = async () => {
  await db
    .insert(schema.CollectionMediaAsset)
    .values(collectionMediaAssets)
    .onConflictDoUpdate({
      target: schema.CollectionMediaAsset.id,
      set: {
        collectionId: sql.raw(
          `excluded.${schema.CollectionMediaAsset.collectionId.name}`,
        ),
        mediaAssetId: sql.raw(
          `excluded.${schema.CollectionMediaAsset.mediaAssetId.name}`,
        ),
      },
    });

  const createdCollectionMediaAssets =
    await db.query.CollectionMediaAsset.findMany();
  console.log(JSON.stringify(createdCollectionMediaAssets, null, 2));
  console.log(
    "🧨 Done seeding the collection media assets table successfully...\n",
  );
};

const main = async () => {
  console.log("🧨 Started seeding the database...\n");
  await seedBooks();
  await seedUsers();
  await seedKnowledgeResources();
  await seedMediaAssets();
  await seedCollections();
  await seedCollectionItems();
  await seedCollectionMediaAssets();

  console.log("\n🧨 Done seeding the database successfully...\n");
};

await main();
