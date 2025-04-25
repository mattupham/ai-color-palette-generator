// Add import of mock data module at the top of the file
import { getMockPalettes } from "./mock-palettes";

// Mapping of feelings to base colors (in HSL format for easier manipulation)
const feelingColorMap: Record<
  string,
  { hue: number; saturation: number; lightness: number }
> = {
  // Happy, joyful emotions
  happy: { hue: 50, saturation: 90, lightness: 55 }, // Yellow
  joy: { hue: 40, saturation: 100, lightness: 50 }, // Golden yellow
  excited: { hue: 30, saturation: 100, lightness: 50 }, // Orange
  energetic: { hue: 15, saturation: 100, lightness: 50 }, // Bright orange-red

  // Calm, peaceful emotions
  calm: { hue: 200, saturation: 60, lightness: 70 }, // Light blue
  peaceful: { hue: 180, saturation: 50, lightness: 75 }, // Soft teal
  relaxed: { hue: 150, saturation: 40, lightness: 70 }, // Mint green
  tranquil: { hue: 170, saturation: 30, lightness: 80 }, // Pale teal

  // Sad, melancholy emotions
  sad: { hue: 240, saturation: 30, lightness: 60 }, // Muted blue
  melancholy: { hue: 260, saturation: 20, lightness: 50 }, // Muted purple
  gloomy: { hue: 230, saturation: 15, lightness: 40 }, // Dark blue-gray
  depressed: { hue: 250, saturation: 10, lightness: 30 }, // Dark purple-gray

  // Angry, intense emotions
  angry: { hue: 0, saturation: 100, lightness: 50 }, // Red
  intense: { hue: 350, saturation: 90, lightness: 45 }, // Deep red
  passionate: { hue: 355, saturation: 95, lightness: 50 }, // Bright red
  frustrated: { hue: 5, saturation: 90, lightness: 45 }, // Red-orange

  // Love, romantic emotions
  love: { hue: 330, saturation: 100, lightness: 65 }, // Pink
  romantic: { hue: 340, saturation: 80, lightness: 70 }, // Light pink
  affectionate: { hue: 320, saturation: 70, lightness: 75 }, // Soft pink

  // Creative, inspired emotions
  creative: { hue: 280, saturation: 70, lightness: 60 }, // Purple
  inspired: { hue: 260, saturation: 60, lightness: 65 }, // Lavender
  imaginative: { hue: 290, saturation: 50, lightness: 70 }, // Light purple

  // Focused, determined emotions
  focused: { hue: 210, saturation: 80, lightness: 40 }, // Deep blue
  determined: { hue: 220, saturation: 70, lightness: 45 }, // Navy blue
  confident: { hue: 200, saturation: 90, lightness: 35 }, // Dark teal

  // Natural, earthy emotions
  natural: { hue: 120, saturation: 40, lightness: 50 }, // Green
  earthy: { hue: 30, saturation: 60, lightness: 40 }, // Brown
  grounded: { hue: 45, saturation: 50, lightness: 45 }, // Tan

  // Default for unknown feelings
  neutral: { hue: 210, saturation: 10, lightness: 50 }, // Gray-blue
};

// Convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Find the closest matching feeling
function findClosestFeeling(input: string): string {
  const normalizedInput = input.toLowerCase();

  // Check for exact matches first
  for (const feeling in feelingColorMap) {
    if (normalizedInput.includes(feeling)) {
      return feeling;
    }
  }

  // Check for partial matches
  const words = normalizedInput.split(/\s+/);
  for (const word of words) {
    for (const feeling in feelingColorMap) {
      if (word.includes(feeling) || feeling.includes(word)) {
        return feeling;
      }
    }
  }

  // Default to neutral if no match found
  return "neutral";
}

// Generate a palette based on a base color
function generatePalette(baseColor: {
  hue: number;
  saturation: number;
  lightness: number;
}): string[] {
  const palette: string[] = [];

  // Analogous colors (colors next to each other on the color wheel)
  const hue1 = (baseColor.hue - 30 + 360) % 360;
  const hue2 = (baseColor.hue + 30) % 360;

  // Add colors to palette
  palette.push(
    hslToHex(hue1, baseColor.saturation * 0.9, baseColor.lightness * 1.1)
  );
  palette.push(
    hslToHex(baseColor.hue, baseColor.saturation, baseColor.lightness)
  );
  palette.push(
    hslToHex(hue2, baseColor.saturation * 0.8, baseColor.lightness * 0.9)
  );

  // Add a complementary color (opposite on the color wheel)
  const complementaryHue = (baseColor.hue + 180) % 360;
  palette.push(
    hslToHex(
      complementaryHue,
      baseColor.saturation * 0.7,
      baseColor.lightness * 0.8
    )
  );

  // Add a neutral color
  palette.push(hslToHex(baseColor.hue, baseColor.saturation * 0.15, 90));

  return palette;
}

// Generate monochromatic palette (variations of the same color)
function generateMonochromaticPalette(baseColor: {
  hue: number;
  saturation: number;
  lightness: number;
}): string[] {
  return [
    hslToHex(
      baseColor.hue,
      baseColor.saturation * 0.8,
      baseColor.lightness * 1.3
    ),
    hslToHex(
      baseColor.hue,
      baseColor.saturation * 0.9,
      baseColor.lightness * 1.15
    ),
    hslToHex(baseColor.hue, baseColor.saturation, baseColor.lightness),
    hslToHex(
      baseColor.hue,
      baseColor.saturation * 1.1,
      baseColor.lightness * 0.85
    ),
    hslToHex(
      baseColor.hue,
      baseColor.saturation * 1.2,
      baseColor.lightness * 0.7
    ),
  ];
}

// Generate triadic palette (three colors evenly spaced on the color wheel)
function generateTriadicPalette(baseColor: {
  hue: number;
  saturation: number;
  lightness: number;
}): string[] {
  const hue1 = (baseColor.hue + 120) % 360;
  const hue2 = (baseColor.hue + 240) % 360;

  return [
    hslToHex(baseColor.hue, baseColor.saturation, baseColor.lightness),
    hslToHex(
      baseColor.hue,
      baseColor.saturation * 0.7,
      baseColor.lightness * 1.1
    ),
    hslToHex(hue1, baseColor.saturation * 0.9, baseColor.lightness * 0.9),
    hslToHex(hue2, baseColor.saturation * 0.8, baseColor.lightness),
    hslToHex(baseColor.hue, baseColor.saturation * 0.2, 90),
  ];
}

// Add slight randomization to make palettes more unique
function addRandomization(color: {
  hue: number;
  saturation: number;
  lightness: number;
}): {
  hue: number;
  saturation: number;
  lightness: number;
} {
  return {
    hue: (color.hue + Math.floor(Math.random() * 20) - 10 + 360) % 360,
    saturation: Math.min(
      100,
      Math.max(0, color.saturation + Math.floor(Math.random() * 20) - 10)
    ),
    lightness: Math.min(
      100,
      Math.max(0, color.lightness + Math.floor(Math.random() * 20) - 10)
    ),
  };
}

// Define the palette type
export interface Palette {
  name: string;
  colors: string[];
  roles?: string[];
}

interface PaletteResponse {
  palettes: Palette[];
  feeling: string;
}

// Function to generate palettes using the OpenAI API
export async function generatePalettes(
  feeling: string,
  useMockData: boolean
): Promise<Palette[]> {
  if (useMockData) {
    console.log("Using mock data for feeling:", feeling);
    // Return mock palettes based on feeling
    return getMockPalettes(feeling);
  }

  // Continue with the real API call if mock data is not enabled
  try {
    const response = await fetch("/api/generate-palettes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Now we pass the actual feeling entered by the user
      body: JSON.stringify({ feeling }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate palettes");
    }

    const data: PaletteResponse = await response.json();

    // Return the palettes directly
    return data.palettes;
  } catch (error) {
    console.error("Error generating palettes:", error);
    // Return some fallback palettes in case of error
    return [
      {
        name: "Fallback Warm",
        colors: ["#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#355C7D"],
        roles: ["background", "primary", "secondary", "accent", "text"],
      },
      {
        name: "Fallback Natural",
        colors: ["#99B898", "#FECEAB", "#FF847C", "#E84A5F", "#2A363B"],
        roles: ["background", "primary", "secondary", "accent", "text"],
      },
      {
        name: "Fallback Soft",
        colors: ["#A8E6CE", "#DCEDC2", "#FFD3B5", "#FFAAA6", "#FF8C94"],
        roles: ["background", "primary", "secondary", "accent", "text"],
      },
    ];
  }
}
