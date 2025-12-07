import { router } from "../server";
import { paletteRouter } from "./palette";

export const appRouter = router({
	palette: paletteRouter,
});

export type AppRouter = typeof appRouter;
