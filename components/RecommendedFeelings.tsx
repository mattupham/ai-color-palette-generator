import { Badge } from "@/components/ui/badge";

interface RecommendedFeelingsProps {
	feelings: string[];
	onFeelingClick: (feeling: string) => void;
}

export function RecommendedFeelings({
	feelings,
	onFeelingClick,
}: RecommendedFeelingsProps) {
	return (
		<div className="mx-auto mb-4 flex max-w-lg flex-wrap justify-center gap-2">
			{feelings.map((feeling) => (
				<Badge
					className="cursor-pointer transition-colors hover:bg-secondary"
					key={feeling}
					onClick={() => onFeelingClick(feeling)}
					variant="outline"
				>
					{feeling}
				</Badge>
			))}
		</div>
	);
}
