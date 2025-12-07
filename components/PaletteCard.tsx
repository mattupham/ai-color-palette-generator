import {
	AccessibilityToggle,
	AccessibilityView,
} from "@/components/accessibility-view";
import { CopyButton } from "@/components/copy-button";
import type { Palette } from "@/lib/palette-generator";

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
			className={`space-y-2 transition-all duration-500 ${
				shouldFade ? "pointer-events-none opacity-20" : "opacity-100"
			}`}
			ref={setRef}
		>
			<div className="mb-2 flex items-center justify-between">
				<span className="font-medium text-sm">
					{palette.name || `Palette ${index + 1}`}
				</span>
				<div className="flex items-center gap-2">
					<AccessibilityToggle
						onToggleAccessibility={onToggleAccessibility}
						showAccessibility={showAccessibility}
					/>
				</div>
			</div>
			<div className="flex h-24 w-full overflow-hidden rounded-lg">
				{palette.colors.map((color, colorIndex) => (
					<div
						className="group relative flex-1 cursor-pointer"
						key={colorIndex}
						style={{ backgroundColor: color }}
					>
						<div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
							<CopyButton textToCopy={color} />
						</div>
						{palette.roles && (
							<div className="absolute right-0 bottom-1 left-0 text-center font-semibold text-xs opacity-0 transition-opacity group-hover:opacity-100">
								<span className="rounded bg-black/60 px-1 py-0.5 text-white">
									{palette.roles[colorIndex]}
								</span>
							</div>
						)}
					</div>
				))}
			</div>
			<div className="grid w-full grid-cols-5 gap-0">
				{palette.colors.map((color, colorIndex) => (
					<div className="text-center font-mono text-xs" key={colorIndex}>
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
