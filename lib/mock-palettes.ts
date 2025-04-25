import { Palette } from "./palette-generator";

// Mock palette data for "professional" prompt
const professionalPalettes: Palette[] = [
  {
    name: "Corporate Calm",
    colors: ["#f5f5f5", "#085f73", "#0e9396", "#94e0d0", "#081219"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Executive Elegance",
    colors: ["#e0e0e0", "#2b2d2d", "#415475", "#dfd6c8", "#2d4057"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Boardroom Blue",
    colors: ["#f6f6f6", "#1b2b3b", "#415a77", "#778b99", "#091b28"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Professional Slate",
    colors: ["#f5f5f5", "#333333", "#627a82", "#e0b6c1", "#1c3a3e"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Business Beige",
    colors: ["#f7f7f7", "#3a3a3a", "#5c5c5c", "#ececec", "#3c3c3c"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Neutral Negotiation",
    colors: ["#ffffff", "#1a1a1a", "#3a3a3a", "#7a7a7a", "#262626"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Trustworthy Teal",
    colors: ["#f5f5f5", "#2d6653", "#2a908f", "#f0c46a", "#142136"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Official Olive",
    colors: ["#fefefe", "#3a3a3a", "#6b765c", "#a3a36d", "#1c1c1c"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Strategic Stone",
    colors: ["#f5f5f5", "#282828", "#545c61", "#c6c6c6", "#1b1b1e"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Edgy Efficiency",
    colors: ["#f2f2f2", "#0f0f0f", "#3d3d3d", "#767676", "#1a1a1a"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
];

// Mock palette data for "summer" prompt
const summerPalettes: Palette[] = [
  {
    name: "Sunny Beach",
    colors: ["#f5f5f5", "#ff6540", "#fde88c", "#24c4a7", "#333333"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Lush Meadow",
    colors: ["#f0fff0", "#32cd32", "#ffc187", "#008480", "#2f2f2f"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Ocean Breeze",
    colors: ["#e8ffff", "#0087ff", "#6662b4", "#2c8a57", "#2c2c2e"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Tropical Paradise",
    colors: ["#fafad2", "#ff6347", "#40e0d0", "#2c3e50", "#333333"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Sunset Glow",
    colors: ["#fffdfe", "#ff4500", "#ff69b4", "#990000", "#2f2f2f"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Citrus Bliss",
    colors: ["#ffebcd", "#ffa500", "#ff4500", "#32cd32", "#333333"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Summer Sky",
    colors: ["#f0f8ff", "#1e90ff", "#4682b4", "#3cb371", "#2c2c2e"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Coral Reef",
    colors: ["#fff5ee", "#ff7f50", "#ff4500", "#2f4f4f", "#333333"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Golden Sands",
    colors: ["#fffacd", "#ffd700", "#ff8c00", "#8b4513", "#2f2f2f"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Morning Mist",
    colors: ["#f5f5f5", "#98fb98", "#90ee90", "#006400", "#2f2f2f"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
];

// Mock palette data for "autumn" prompt
const autumnPalettes: Palette[] = [
  {
    name: "Crisp Leaves",
    colors: ["#4A2E29", "#7A4E4F", "#D19C8C", "#E8C9AB", "#F5F5F5"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Golden Harvest",
    colors: ["#563C22", "#8C6239", "#E7B365", "#FAE6C8", "#333333"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Foggy Morning",
    colors: ["#2B2F33", "#5A6A73", "#889595", "#DBE2E6", "#FFFFFF"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Russet Woods",
    colors: ["#3A2423", "#6C4C3F", "#A2704F", "#DFB593", "#FAFAFA"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Pumpkin Spice",
    colors: ["#4C2F27", "#805045", "#CC5A3A", "#F0DDC6", "#F5F5F5"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Misty Forest",
    colors: ["#333333", "#535A56", "#8D9B8E", "#CDD7D4", "#F5F5F5"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Burnt Ochre",
    colors: ["#3F1C18", "#794A31", "#C86C46", "#E5A576", "#FBFBFB"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
  {
    name: "Maple Leaves",
    colors: ["#442220", "#854438", "#D15F4D", "#FCA990", "#F8F9F9"],
    roles: ["background", "primary", "secondary", "accent", "text"],
  },
];

// Collection of all mock palettes by feeling
const mockPalettesByFeeling: Record<string, Palette[]> = {
  professional: professionalPalettes,
  summer: summerPalettes,
  autumn: autumnPalettes,
};

// Function to get mock palettes based on feeling
export function getMockPalettes(feeling: string): Palette[] | null {
  const normalizedFeeling = feeling.toLowerCase().trim();

  console.log("normalizedFeeling", normalizedFeeling);

  // Check for exact match first
  if (mockPalettesByFeeling[normalizedFeeling]) {
    return mockPalettesByFeeling[normalizedFeeling];
  }

  // Look for partial matches
  for (const key of Object.keys(mockPalettesByFeeling)) {
    if (normalizedFeeling.includes(key) || key.includes(normalizedFeeling)) {
      return mockPalettesByFeeling[key];
    }
  }

  // If no match found, return null
  return null;
}
