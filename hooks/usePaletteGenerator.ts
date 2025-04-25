import { Palette } from "@/lib/palette-generator";
import {
  getFallbackPalettes,
  getMockPalettes,
  usePaletteMutation,
} from "@/lib/palette-queries";
import { useState } from "react";

// Define special preset feelings that use mock data
const PRESET_FEELINGS = ["professional", "summer"];

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
    // Check if this is a preset feeling that uses mock data
    if (PRESET_FEELINGS.includes(feelingText.toLowerCase())) {
      setPalettes(getMockPalettes(feelingText.toLowerCase()));
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
