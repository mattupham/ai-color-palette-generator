import { Badge } from "@/components/ui/badge";

interface RecommendedVibesProps {
	vibes: string[];
	onVibeClick: (vibe: string) => void;
}

export function RecommendedVibes({
	vibes,
	onVibeClick,
}: RecommendedVibesProps) {
	return (
		<div className="mx-auto mb-4 flex max-w-lg flex-wrap justify-center gap-2">
			{vibes.map((vibe) => (
				<Badge
					className="cursor-pointer transition-colors hover:bg-secondary"
					key={vibe}
					onClick={() => onVibeClick(vibe)}
					variant="outline"
				>
					{vibe}
				</Badge>
			))}
		</div>
	);
}
