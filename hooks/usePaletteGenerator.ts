import type { Palette } from "@/lib/palette-generator";
import { getFallbackPalettes, getMockPalettes } from "@/lib/palette-queries";
import { trpc } from "@/lib/trpc/client";
import { useEffect, useState } from "react";

export function usePaletteGenerator(defaultFeeling: string) {
  const [feeling, setFeeling] = useState(defaultFeeling);
  const [inputValue, setInputValue] = useState("");
  const [palettes, setPalettes] = useState<Palette[] | undefined>(undefined);

  // Use tRPC mutation for generating palettes
  const mutation = trpc.palette.generatePalettes.useMutation();

  // Core function to generate a palette based on feeling
  const generatePalette = (feelingText: string) => {
    // Try to get mock palettes first
    const mockPalettes = getMockPalettes(feelingText.toLowerCase());

    // If we have mock palettes, use them
    if (mockPalettes && mockPalettes.length > 0) {
      setPalettes(mockPalettes);
    } else {
      // Make tRPC call for AI-generated palettes
      mutation.mutate(
        { feeling: feelingText },
        {
          onSuccess: (data) => {
            setPalettes(data.palettes);
          },
          onError: () => {
            // Use fallback palettes on error
            setPalettes(getFallbackPalettes());
          },
        }
      );
    }
  };

  // Load professional palette by default
  // biome-ignore lint/correctness/useExhaustiveDependencies: generatePalette is stable and doesn't need to be in dependencies
  useEffect(() => {
    generatePalette(defaultFeeling);
  }, [defaultFeeling]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setFeeling(inputValue);
    generatePalette(inputValue);
  };

  // Handle clicking on a recommended feeling
  const handleRecommendedFeelingClick = (recommendedFeeling: string) => {
    setInputValue(recommendedFeeling);
    setFeeling(recommendedFeeling);
    generatePalette(recommendedFeeling);
  };

  return {
    feeling,
    inputValue,
    setInputValue,
    palettes,
    mutation,
    handleSubmit,
    handleRecommendedFeelingClick,
  };
}
