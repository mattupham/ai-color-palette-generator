import { Palette } from "@/lib/palette-generator";
import {
  getFallbackPalettes,
  getMockPalettes,
  usePaletteMutation,
} from "@/lib/palette-queries";
import { useEffect, useState } from "react";

export function usePaletteGenerator() {
  const [feeling, setFeeling] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [palettes, setPalettes] = useState<Palette[] | undefined>(undefined);

  // Use React Query mutation for generating palettes
  const {
    mutate,
    isPending: isGenerating,
    isError,
    error,
  } = usePaletteMutation();

  // Load professional palette by default
  useEffect(() => {
    generatePalette("professional");
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setFeeling(inputValue);
    generatePalette(inputValue);
  };

  // Handle regenerating palettes
  const regeneratePalettes = () => {
    if (!feeling.trim()) return;
    generatePalette(feeling);
  };

  // Handle clicking on a recommended feeling
  const handleRecommendedFeelingClick = (recommendedFeeling: string) => {
    setInputValue(recommendedFeeling);
    setFeeling(recommendedFeeling);
    generatePalette(recommendedFeeling);
  };

  // Core function to generate a palette based on feeling
  const generatePalette = (feelingText: string) => {
    // Try to get mock palettes first
    const mockPalettes = getMockPalettes(feelingText.toLowerCase());

    // If we have mock palettes, use them
    if (mockPalettes && mockPalettes.length > 0) {
      setPalettes(mockPalettes);
    } else {
      // Make API call for AI-generated palettes
      mutate(feelingText, {
        onSuccess: (data) => {
          setPalettes(data.palettes);
        },
        onError: () => {
          // Use fallback palettes on error
          setPalettes(getFallbackPalettes());
        },
      });
    }
  };

  return {
    feeling,
    inputValue,
    setInputValue,
    palettes,
    isGenerating,
    isError,
    error,
    handleSubmit,
    regeneratePalettes,
    handleRecommendedFeelingClick,
  };
}
