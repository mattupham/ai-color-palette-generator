import { useCallback, useEffect, useRef } from "react";
import { PaletteCard } from "@/components/PaletteCard";
import type { Palette } from "@/lib/palette-generator";

interface PaletteDisplayProps {
	palettes: Palette[];
	isPending: boolean;
	accessibilityStates: Record<number, boolean>;
	onToggleAccessibility: (index: number) => void;
	activePaletteIndex: number | null;
	inputValue?: string;
}

export function PaletteDisplay({
	palettes,
	isPending: _isPending,
	accessibilityStates,
	onToggleAccessibility,
	activePaletteIndex,
	inputValue: _inputValue = "",
}: PaletteDisplayProps) {
	// Create a stable ref object - MUST be before any conditional returns
	const paletteRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
	const lastAccessibilityStates = useRef<Record<number, boolean>>({});

	// Memoize the set ref callback - MUST be before any conditional returns
	const setRef = useCallback(
		(index: number) => (el: HTMLDivElement | null) => {
			paletteRefs.current.set(index, el);
		},
		[],
	);

	// Function to center the active palette
	const centerActivePalette = useCallback((index: number) => {
		const element = paletteRefs.current.get(index);
		if (!element) return;

		// Use the built-in scrollIntoView with block: "center" for perfect centering
		element.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	}, []);

	// Detect when accessibility is newly opened for a palette
	useEffect(() => {
		// Find the index that was just toggled on
		for (let index = 0; index < palettes.length; index++) {
			const wasOpen = !!lastAccessibilityStates.current[index];
			const isNowOpen = !!accessibilityStates[index];

			// If this palette's accessibility view was just opened, center it
			if (!wasOpen && isNowOpen) {
				// Longer delay to ensure the accessibility panel has fully expanded
				const delay = 200;
				setTimeout(() => centerActivePalette(index), delay);
			}
		}

		// Store current state for next comparison
		lastAccessibilityStates.current = { ...accessibilityStates };
	}, [accessibilityStates, centerActivePalette, palettes.length]);

	// Also center when active palette changes
	useEffect(() => {
		if (activePaletteIndex !== null) {
			const delay = 200;
			setTimeout(() => centerActivePalette(activePaletteIndex), delay);
		}
	}, [activePaletteIndex, centerActivePalette]);

	// Early return AFTER all hooks are defined
	if (!palettes || palettes.length === 0) {
		return null;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-2xl">Your Palettes</h2>
			</div>

			<div className="grid gap-6">
				{palettes.map((palette, index) => {
					const isActive = activePaletteIndex === index;
					const shouldFade = activePaletteIndex !== null && !isActive;

					return (
						<PaletteCard
							index={index}
							key={index}
							onToggleAccessibility={() => onToggleAccessibility(index)}
							palette={palette}
							setRef={setRef(index)}
							shouldFade={shouldFade}
							showAccessibility={!!accessibilityStates[index]}
						/>
					);
				})}
			</div>
		</div>
	);
}
