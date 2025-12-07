import type { Palette } from "./palette-generator";

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

// Collection of all mock palettes by feeling
const mockPalettesByFeeling: Record<string, Palette[]> = {
	professional: professionalPalettes,
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
