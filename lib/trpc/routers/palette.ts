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

			// Follow OpenAI's Responses API recommendations
			const response = await openai.responses.create({
				model: env.OPENAI_MODEL,
				input: prompt,
				reasoning: {
					effort: "minimal", // Options: minimal, low, medium, high, xhigh
				},
			});

			// Access output_text directly as per OpenAI documentation
			const content = response.output_text;
			if (!content) {
				throw new Error("No output_text returned from OpenAI");
			}

			const data = JSON.parse(content);
			return paletteResponseSchema.parse(data);
		}),
});
