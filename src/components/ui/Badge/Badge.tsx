import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../../lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "danger" | "accent";
}

const variantStyles = {
  default: "bg-base-surface text-base-ink border-base-ink",
  success: "bg-feedback-success text-white border-base-ink",
  danger: "bg-feedback-danger text-white border-base-ink",
  accent: "bg-accent-lime text-base-ink border-base-ink",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 font-display font-bold text-xs uppercase tracking-wider px-2.5 py-1 rounded-brutal border-3",
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
