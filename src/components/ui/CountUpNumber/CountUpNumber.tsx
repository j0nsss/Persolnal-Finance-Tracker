import { useCountUp } from "../../../hooks/useCountUp";
import { cn } from "../../../lib/utils";

interface CountUpNumberProps {
  target: number;
  duration?: number;
  className?: string;
  prefix?: string;
}

export function CountUpNumber({ target, duration, className, prefix = "" }: CountUpNumberProps) {
  const value = useCountUp(target, duration);

  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {prefix}{value.toLocaleString("id-ID")}
    </span>
  );
}
