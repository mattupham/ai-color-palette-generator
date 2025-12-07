import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonsProps {
	count?: number;
}

export function LoadingSkeletons({ count = 8 }: LoadingSkeletonsProps) {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-2xl">Generating Palettes...</h2>
			</div>

			<div className="grid gap-6">
				{[...Array(count)].map((_, index) => (
					<div className="space-y-2" key={index}>
						<div className="mb-2 flex items-center justify-between">
							<Skeleton className="h-5 w-24" />
						</div>
						<Skeleton className="h-24 w-full rounded-lg" />
						<div className="flex justify-between">
							{[1, 2, 3, 4, 5].map((_, colorIndex) => (
								<div className="font-mono text-xs" key={colorIndex}>
									<Skeleton className="h-4 w-16" />
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
