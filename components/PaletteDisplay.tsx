import { memo, useCallback, useEffect, useRef, useState } from "react";
import { PaletteCard } from "@/components/PaletteCard";
import type { Palette } from "@/lib/palette-generator";

interface PaletteDisplayProps {
	palettes: Palette[];
}

export const PaletteDisplay = memo(function PaletteDisplay({
	palettes,
}: PaletteDisplayProps) {
	// Move accessibility state into this component
	const [accessibilityStates, setAccessibilityStates] = useState<
		Record<number, boolean>
	>({});
	const [activePaletteIndex, setActivePaletteIndex] = useState<number | null>(
		null,
	);

	// Create a stable ref object - MUST be before any conditional returns
	const paletteRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
	const lastAccessibilityStates = useRef<Record<number, boolean>>({});

	// Toggle accessibility for a specific palette
	const toggleAccessibility = (index: number) => {
		const isCurrentlyOpen = !!accessibilityStates[index];
		const newState = !isCurrentlyOpen;

		// Create a new state object with all dropdowns closed
		const newAccessibilityStates: Record<number, boolean> = {};

		// If we're opening this dropdown, set only this one to true
		if (newState) {
			newAccessibilityStates[index] = true;
		}

		setAccessibilityStates(newAccessibilityStates);
		setActivePaletteIndex(newState ? index : null);
	};

	// Simple ref setter - no need for useCallback
	const setRef = (index: number) => (el: HTMLDivElement | null) => {
		paletteRefs.current.set(index, el);
	};

	// Function to center the active palette - memoized to satisfy useEffect deps
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
	}, [accessibilityStates, palettes.length, centerActivePalette]);

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
				<h2 className="font-semibold text-2xl">Palettes</h2>
			</div>

			<div className="grid gap-6">
				{palettes.map((palette, index) => {
					const isActive = activePaletteIndex === index;
					const shouldFade = activePaletteIndex !== null && !isActive;

					return (
						<PaletteCard
							index={index}
							key={index}
							onToggleAccessibility={() => toggleAccessibility(index)}
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
});
