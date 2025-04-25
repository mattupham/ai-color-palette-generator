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
    <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
      {feelings.map((feeling) => (
        <Badge
          key={feeling}
          variant="outline"
          className="cursor-pointer hover:bg-secondary transition-colors"
          onClick={() => onFeelingClick(feeling)}
        >
          {feeling}
        </Badge>
      ))}
    </div>
  );
}
