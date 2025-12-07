import { router } from "../server";
import { paletteRouter } from "./palette";
import { userRouter } from "./user";

export const appRouter = router({
  palette: paletteRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

