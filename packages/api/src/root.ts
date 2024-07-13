import { shelfRouter } from "./router/shelf";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  shelf: shelfRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
