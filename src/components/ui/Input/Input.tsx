import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full font-body text-base px-4 py-2.5 rounded-brutal border-3 bg-base-surface",
            "placeholder:text-base-ink/40",
            "focus:outline-none focus:ring-0",
            error ? "border-feedback-danger" : "border-base-ink",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 font-body text-sm text-feedback-danger flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
