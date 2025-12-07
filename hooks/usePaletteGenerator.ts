import type { Palette } from "@/lib/palette-generator";
import { getFallbackPalettes, getMockPalettes } from "@/lib/palette-queries";
import { trpc } from "@/lib/trpc/client";
import { useEffect, useState } from "react";

export function usePaletteGenerator(defaultVibe: string) {
  const [vibe, setVibe] = useState(defaultVibe);
  const [inputValue, setInputValue] = useState("");
  const [palettes, setPalettes] = useState<Palette[] | undefined>(undefined);

  // Use tRPC mutation for generating palettes
  const mutation = trpc.palette.generatePalettes.useMutation();

  // Core function to generate a palette based on vibe
  const generatePalette = (vibeText: string) => {
    // Try to get mock palettes first
    const mockPalettes = getMockPalettes(vibeText.toLowerCase());

    // If we have mock palettes, use them
    if (mockPalettes && mockPalettes.length > 0) {
      setPalettes(mockPalettes);
    } else {
      // Make tRPC call for AI-generated palettes
      mutation.mutate(
        { vibe: vibeText },
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
    generatePalette(defaultVibe);
  }, [defaultVibe]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setVibe(inputValue);
    generatePalette(inputValue);
  };

  // Handle clicking on a recommended vibe
  const handleRecommendedVibeClick = (recommendedVibe: string) => {
    setInputValue(recommendedVibe);
    setVibe(recommendedVibe);
    generatePalette(recommendedVibe);
  };

  return {
    vibe,
    inputValue,
    setInputValue,
    palettes,
    mutation,
    handleSubmit,
    handleRecommendedVibeClick,
  };
}
