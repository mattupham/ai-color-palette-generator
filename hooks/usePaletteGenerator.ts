import { useCallback, useEffect, useState } from "react";
import type { Palette } from "@/lib/palette-generator";
import { getFallbackPalettes, getMockPalettes } from "@/lib/palette-queries";
import { trpc } from "@/lib/trpc/client";

export function usePaletteGenerator(defaultVibe: string) {
	const [vibe, setVibe] = useState(defaultVibe);
	const [inputValue, setInputValue] = useState("");
	const [palettes, setPalettes] = useState<Palette[] | undefined>(undefined);

	const mutation = trpc.palette.generatePalettes.useMutation();

	const generatePalette = useCallback(
		(vibeText: string) => {
			const mockPalettes = getMockPalettes(vibeText.toLowerCase());

			if (mockPalettes && mockPalettes.length > 0) {
				setPalettes(mockPalettes);
			} else {
				mutation.mutate(
					{ vibe: vibeText },
					{
						onSuccess: (data) => {
							setPalettes(data.palettes);
						},
						onError: () => {
							setPalettes(getFallbackPalettes());
						},
					},
				);
			}
		},
		[mutation],
	);

	useEffect(() => {
		generatePalette(defaultVibe);
	}, [defaultVibe, generatePalette]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim()) return;

		setVibe(inputValue);
		generatePalette(inputValue);
	};

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
