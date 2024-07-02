import { authRouter } from "./router/auth";
import { noteRouter } from "./router/note";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  note: noteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
