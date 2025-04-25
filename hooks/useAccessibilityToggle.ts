import { useState } from "react";

export function useAccessibilityToggle() {
  const [accessibilityStates, setAccessibilityStates] = useState<
    Record<number, boolean>
  >({});
  const [activePaletteIndex, setActivePaletteIndex] = useState<number | null>(
    null
  );

  const toggleAccessibility = (index: number) => {
    const isCurrentlyOpen = !!accessibilityStates[index];
    const newState = !isCurrentlyOpen;

    // Create a new state object with all dropdowns closed
    const newAccessibilityStates: Record<number, boolean> = {};

    // If we're opening this dropdown, set only this one to true
    // If we're closing this dropdown, keep all closed
    if (newState) {
      newAccessibilityStates[index] = true;
    }

    setAccessibilityStates(newAccessibilityStates);

    // If showing accessibility, set this palette as active, otherwise set to null
    setActivePaletteIndex(newState ? index : null);
  };

  return {
    accessibilityStates,
    activePaletteIndex,
    toggleAccessibility,
  };
}
