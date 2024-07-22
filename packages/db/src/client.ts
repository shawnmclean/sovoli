// import { sql } from "@vercel/postgres";
// import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";

// export const db = drizzle(sql, { schema });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(client, { schema });
