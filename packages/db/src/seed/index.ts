import { db, eq, schema, sql } from "../";
import { shelves } from "../schema";

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
            books: [],
          },
          {
            name: "Wardrobe Bottom Left Shelf",
            description: "The Psychology and Self-Help Shelf",
            books: [],
          },
        ],
      },
      {
        name: "Writing Desk",
        slug: "writing-desk",
        description: "A desk with a drawer and shelves",
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

      if (user) {
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

          if (furniture) {
          }
        }
      }
    }

    const users = await db.query.users.findMany({
      with: {
        furnitures: {
          with: {
            shelves: true,
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

const main = async () => {
  console.log("🧨 Started seeding the database...\n");
  await seedUsers();
  console.log("\n🧨 Done seeding the database successfully...\n");
};

main();
