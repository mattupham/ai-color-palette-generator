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

  // Memoize the set ref callback - MUST be before any conditional returns
  const setRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      paletteRefs.current.set(index, el);
    },
    []
  );

  // Scroll active palette to center when accessibility is toggled - MUST be before any conditional returns
  useEffect(() => {
    if (activePaletteIndex === null) return;

    // Create a separate function for the scrolling logic
    const scrollToActive = () => {
      const element = paletteRefs.current.get(activePaletteIndex);
      if (!element) return;

      // Get the element's position and dimensions
      const rect = element.getBoundingClientRect();

      // Account for the fixed header (approximately 56px)
      const headerOffset = 56;

      // Calculate the scroll position to center the element
      // Add a small adjustment to better center the accessibility panel
      const adjustment = 60; // Additional offset to center the accessibility details better
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = window.scrollY + rect.top;

      // Calculate the ideal position that centers both the palette and its details
      const scrollPosition =
        elementTop -
        windowHeight / 2 +
        elementHeight / 2 -
        headerOffset +
        adjustment;

      // Scroll to the calculated position
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    };

    // Use requestAnimationFrame for better timing
    const timerId = setTimeout(() => {
      requestAnimationFrame(scrollToActive);
    }, 125);

    return () => clearTimeout(timerId);
  }, [activePaletteIndex, accessibilityStates]);

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
              isActive={isActive}
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
