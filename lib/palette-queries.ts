import { getMockPalettes } from "@/lib/mock-palettes";
import { Palette } from "@/lib/palette-generator";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

// Interface for API response
interface PaletteResponse {
  palettes: Palette[];
  feeling: string;
}

// Query function for generating palettes
const fetchPalettes = async (feeling: string): Promise<PaletteResponse> => {
  const response = await axios.post("/api/generate-palettes", { feeling });
  return response.data;
};

// React Query hook for palette generation
export const usePaletteQuery = (feeling: string, useMockData: boolean) => {
  return useQuery<PaletteResponse, Error, Palette[]>({
    queryKey: ["palettes", feeling],
    queryFn: () => fetchPalettes(feeling),
    select: (data) => data.palettes,
    enabled: !useMockData && !!feeling,
    // If mock data is enabled, don't execute the query
    placeholderData: useMockData
      ? { palettes: getMockPalettes(feeling) || [], feeling }
      : undefined,
  });
};

// React Query mutation hook for generating palettes
export const usePaletteMutation = () => {
  return useMutation({
    mutationFn: (feeling: string) => fetchPalettes(feeling),
  });
};

// Backward compatible function to maintain compatibility with existing code
export async function generatePalettes(
  feeling: string,
  useMockData: boolean
): Promise<Palette[]> {
  if (useMockData) {
    console.log("Using mock data for feeling:", feeling);
    return getMockPalettes(feeling) || [];
  }

  try {
    const response = await axios.post("/api/generate-palettes", { feeling });
    return response.data.palettes;
  } catch (error) {
    console.error("Error generating palettes:", error);
    return getFallbackPalettes();
  }
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
