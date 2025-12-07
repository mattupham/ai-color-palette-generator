import { z } from "zod";
import { router, protectedProcedure } from "../server";
import { userPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = router({
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const prefs = await ctx.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, ctx.user.id))
      .limit(1);

    return prefs[0] || null;
  }),

  updatePreferences: protectedProcedure
    .input(
      z.object({
        defaultColorCount: z.string().optional(),
        theme: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, ctx.user.id))
        .limit(1);

      if (existing.length > 0) {
        await ctx.db
          .update(userPreferences)
          .set({
            ...input,
            updatedAt: new Date(),
          })
          .where(eq(userPreferences.userId, ctx.user.id));
      } else {
        await ctx.db.insert(userPreferences).values({
          id: crypto.randomUUID(),
          userId: ctx.user.id,
          ...input,
        });
      }

      return { success: true };
    }),
});

