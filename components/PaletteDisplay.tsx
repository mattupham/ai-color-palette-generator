import {
  AccessibilityToggle,
  AccessibilityView,
} from "@/components/accessibility-view";
import { CopyButton } from "@/components/copy-button";
import { Palette } from "@/lib/palette-generator";
import { useCallback, useEffect, useRef } from "react";

interface PaletteDisplayProps {
  palettes: Palette[];
  isGenerating: boolean;
  onRefresh: () => void;
  accessibilityStates: Record<number, boolean>;
  onToggleAccessibility: (index: number) => void;
  activePaletteIndex: number | null;
}

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
            <div
              key={index}
              ref={setRef(index)}
              className={`space-y-2 transition-all duration-500 ${
                shouldFade ? "opacity-20 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {palette.name || `Palette ${index + 1}`}
                </span>
                <div className="flex items-center gap-2">
                  <AccessibilityToggle
                    showAccessibility={!!accessibilityStates[index]}
                    onToggleAccessibility={() => onToggleAccessibility(index)}
                  />
                </div>
              </div>
              <div className="flex h-24 w-full overflow-hidden rounded-lg">
                {palette.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="flex-1 relative group cursor-pointer"
                    style={{ backgroundColor: color }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out bg-black/20">
                      <CopyButton textToCopy={color} />
                    </div>
                    {palette.roles && (
                      <div className="absolute bottom-1 left-0 right-0 text-center text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-black/60 text-white px-1 py-0.5 rounded">
                          {palette.roles[colorIndex]}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-0 w-full">
                {palette.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="text-xs font-mono text-center"
                  >
                    {color}
                  </div>
                ))}
              </div>

              <AccessibilityView
                colors={palette.colors}
                showAccessibility={!!accessibilityStates[index]}
                onToggleAccessibility={() => onToggleAccessibility(index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
