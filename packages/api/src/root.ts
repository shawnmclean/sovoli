import { healthRouter } from "./router/health";
import { shelfRouter } from "./router/shelf";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  shelf: shelfRouter,
  health: healthRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
