import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonsProps {
  count?: number;
}

export function LoadingSkeletons({ count = 10 }: LoadingSkeletonsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Generating Palettes...</h2>
      </div>

      <div className="grid gap-6">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-24 w-full rounded-lg" />
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((_, colorIndex) => (
                <div key={colorIndex} className="text-xs font-mono">
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
