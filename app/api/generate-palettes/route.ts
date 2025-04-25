import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { feeling } = await request.json();

    console.log("Feeling:", feeling);

    if (!feeling || typeof feeling !== "string") {
      return NextResponse.json(
        { error: "Feeling is required and must be a string" },
        { status: 400 }
      );
    }

    const prompt = `
      Generate 10 color palettes based on the feeling or mood: "${feeling}".
      Each palette should have 5 colors.
      Colors should follow WCAG Accessiblity Guideliens as closely as possible
      WCAG Guidelines - AA Standard (minimum): Contrast ratio of at least 4.5:1 for normal text and 3:1 for large text
     Contrast ratio of at least 7:1 for normal text and 4.5:1 for large text.
      Return ONLY a JSON object with the following structure:
      {
        "palettes": [
          {
            "name": "Palette name that relates to the feeling",
            "colors": ["#hexcode1", "#hexcode2", "#hexcode3", "#hexcode4", "#hexcode5"]
          },
          {
            "name": "Second palette name",
            "colors": ["#hexcode1", "#hexcode2", "#hexcode3", "#hexcode4", "#hexcode5"]
          },
          {
            "name": "Third palette name",
            "colors": ["#hexcode1", "#hexcode2", "#hexcode3", "#hexcode4", "#hexcode5"]
          },
          ...
        ],
        "feeling": "${feeling}"
      }
      
      Ensure all hex codes are valid and the colors in each palette are harmonious and reflect the feeling.
      The palettes should be diverse from each other to give the user options.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a color palette generator that creates harmonious color schemes based on feelings or moods. You only respond with valid JSON.",
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
