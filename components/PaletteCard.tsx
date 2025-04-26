import {
  AccessibilityToggle,
  AccessibilityView,
} from "@/components/accessibility-view";
import { CopyButton } from "@/components/copy-button";
import { Palette } from "@/lib/palette-generator";

interface PaletteCardProps {
  palette: Palette;
  index: number;
  shouldFade: boolean;
  showAccessibility: boolean;
  onToggleAccessibility: () => void;
  setRef: (el: HTMLDivElement | null) => void;
}

export function PaletteCard({
  palette,
  index,
  shouldFade,
  showAccessibility,
  onToggleAccessibility,
  setRef,
}: PaletteCardProps) {
  return (
    <div
      ref={setRef}
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
            showAccessibility={showAccessibility}
            onToggleAccessibility={onToggleAccessibility}
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
          <div key={colorIndex} className="text-xs font-mono text-center">
            {color}
          </div>
        ))}
      </div>

      <AccessibilityView
        colors={palette.colors}
        showAccessibility={showAccessibility}
      />
    </div>
  );
}
