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

    const prompt = `
      Generate 10 color palettes based on the feeling or mood: "${feeling}".
      Each palette should have 5 colors that harmoniously work together.

      ACCESSIBILITY REQUIREMENTS (WCAG 2.1):
      1. Contrast Ratios:
         - Text/Background combinations must meet minimum contrast ratios:
           * Normal text (under 18pt): Minimum 4.5:1 (AA), Preferred 7:1 (AAA)
           * Large text (18pt+): Minimum 3:1 (AA), Preferred 4.5:1 (AAA)
         - UI elements and graphical objects: Minimum 3:1 against adjacent colors
      
      2. Color Combinations:
         - Each palette should include at least one light color (#f5f5f5 or lighter) and one dark color (#333333 or darker)
         - Avoid problematic combinations for color blindness (e.g., red/green, blue/purple, green/brown)
         - Ensure adjacent colors have sufficient contrast for boundaries
      
      3. Color Purpose:
         - Include colors suitable for:
           * Primary actions (1 color)
           * Secondary/tertiary actions (1-2 colors)
           * Background/surface variations (1-2 colors)
           * Accent/highlight (1 color)
      
      4. Versatility:
         - Colors should work in both light and dark modes
         - Include colors that maintain their perceptual qualities across devices

      Return ONLY a JSON object with the following structure:
      {
        "palettes": [
          {
            "name": "Meaningful palette name related to the feeling (be creative)",
            "colors": ["#hexcode1", "#hexcode2", "#hexcode3", "#hexcode4", "#hexcode5"],
            "roles": ["background", "primary", "secondary", "accent", "text"]
          },
          ... (repeat for all 10 palettes)
        ],
        "feeling": "${feeling}"
      }
      
      For each palette:
      - Ensure every hex code is valid (6 characters with proper syntax)
      - Calculate and verify contrast ratios between text colors and background colors
      - Assign appropriate roles to each color (background, primary, secondary, accent, text)
      - Make each palette distinct while still reflecting the feeling/mood
      - Consider cultural and psychological color meanings related to the feeling
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
