import { cn } from "../../../lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-brutal border-3 border-base-ink bg-base-surface",
        "relative overflow-hidden before:absolute before:inset-0",
        "before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-base-ink/5 before:to-transparent",
        "before:animate-[shimmer_1.5s_infinite]",
        className,
      )}
    />
  );
}
