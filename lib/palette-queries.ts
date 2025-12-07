import { getMockPalettes } from "@/lib/mock-palettes";
import type { Palette } from "@/lib/palette-generator";

// Note: usePaletteMutation is now provided by tRPC
// Import from: trpc.palette.generatePalettes.useMutation()

// Backward compatible function to maintain compatibility with existing code
export async function generatePalettes(
	feeling: string,
	useMockData: boolean,
): Promise<Palette[]> {
	if (useMockData) {
		console.log("Using mock data for feeling:", feeling);
		return getMockPalettes(feeling) || [];
	}

	// This function is deprecated - use tRPC mutation instead
	console.warn("generatePalettes is deprecated, use tRPC mutation instead");
	return getFallbackPalettes();
}

// Fallback palettes to use in case of error
export const getFallbackPalettes = (): Palette[] => [
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

// Export getMockPalettes for use in page component
export { getMockPalettes };
