import { PaletteCard } from "@/components/PaletteCard";
import { Button } from "@/components/ui/button";
import { Palette } from "@/lib/palette-generator";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

interface PaletteDisplayProps {
  palettes: Palette[];
  isGenerating: boolean;
  onRefresh: () => void;
  accessibilityStates: Record<number, boolean>;
  onToggleAccessibility: (index: number) => void;
  activePaletteIndex: number | null;
}

export function PaletteDisplay({
  palettes,
  isGenerating,
  onRefresh,
  accessibilityStates,
  onToggleAccessibility,
  activePaletteIndex,
}: PaletteDisplayProps) {
  // Create a stable ref object - MUST be before any conditional returns
  const paletteRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
  const lastAccessibilityStates = useRef<Record<number, boolean>>({});

  // Memoize the set ref callback - MUST be before any conditional returns
  const setRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      paletteRefs.current.set(index, el);
    },
    []
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Palettes</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isGenerating}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        {palettes.map((palette, index) => {
          const isActive = activePaletteIndex === index;
          const shouldFade = activePaletteIndex !== null && !isActive;

          return (
            <PaletteCard
              key={index}
              palette={palette}
              index={index}
              shouldFade={shouldFade}
              showAccessibility={!!accessibilityStates[index]}
              onToggleAccessibility={() => onToggleAccessibility(index)}
              setRef={setRef(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
