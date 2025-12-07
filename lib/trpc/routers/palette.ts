import { env } from "@/env";
import { savedPalette } from "@/lib/db/schema";
import { getPaletteGeneratorPrompt } from "@/lib/prompts/palette-generator";
import { eq } from "drizzle-orm";
import { OpenAI } from "openai";
import { z } from "zod";
import { protectedProcedure, router } from "../server";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const paletteSchema = z.object({
  name: z.string(),
  colors: z.array(z.string()),
  roles: z.array(z.string()),
});

const paletteResponseSchema = z.object({
  palettes: z.array(paletteSchema),
  feeling: z.string(),
});

export const paletteRouter = router({
  generatePalettes: protectedProcedure
    .input(z.object({ feeling: z.string() }))
    .mutation(async ({ input }) => {
      const prompt = getPaletteGeneratorPrompt(input.feeling);

      const response = await openai.chat.completions.create({
        model: env.OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert graphic designer and color palette generator that creates harmonious color schemes based on feelings or moods. You only respond with valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content returned from OpenAI");
      }

      const data = JSON.parse(content);
      return paletteResponseSchema.parse(data);
    }),

  savePalette: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        feeling: z.string(),
        colors: z.array(z.string()),
        roles: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = crypto.randomUUID();
      await ctx.db.insert(savedPalette).values({
        id,
        userId: ctx.user.id,
        name: input.name,
        feeling: input.feeling,
        colors: input.colors,
        roles: input.roles,
      });

      return { id };
    }),

  getUserPalettes: protectedProcedure.query(async ({ ctx }) => {
    const palettes = await ctx.db
      .select()
      .from(savedPalette)
      .where(eq(savedPalette.userId, ctx.user.id))
      .orderBy(savedPalette.createdAt);

    return palettes;
  }),

  deletePalette: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(savedPalette).where(eq(savedPalette.id, input.id));

      return { success: true };
    }),
});
