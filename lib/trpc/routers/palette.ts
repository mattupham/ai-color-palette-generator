import { env } from "@/env";
import { getPaletteGeneratorPrompt } from "@/lib/prompts/palette-generator";
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
	vibe: z.string(),
});

export const paletteRouter = router({
	generatePalettes: protectedProcedure
		.input(z.object({ vibe: z.string() }))
		.mutation(async ({ input }) => {
			const prompt = getPaletteGeneratorPrompt(input.vibe);

			const response = await openai.chat.completions.create({
				model: env.OPENAI_MODEL,
				messages: [
					{
						role: "system",
						content:
							"You are an expert graphic designer and color palette generator that creates harmonious color schemes based on vibes or moods. You only respond with valid JSON.",
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
});
