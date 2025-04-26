import { getPaletteGeneratorPrompt } from "@/lib/prompts/palette-generator";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { feeling } = await request.json();

    if (!feeling || typeof feeling !== "string") {
      return NextResponse.json(
        { error: "Feeling is required and must be a string" },
        { status: 400 }
      );
    }

    // Get the prompt from the imported function
    const prompt = getPaletteGeneratorPrompt(feeling);

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL as string,
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

    // Extract the content from the response
    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    // Parse the JSON response
    const data = JSON.parse(content);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating palettes:", error);
    return NextResponse.json(
      { error: "Failed to generate palettes" },
      { status: 500 }
    );
  }
}
