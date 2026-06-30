import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "rounded-brutal border-3 border-base-ink bg-base-surface p-5",
  {
    variants: {
      shadow: {
        default: "shadow-brutal",
        lg: "shadow-brutal-lg",
        none: "shadow-none",
      },
    },
    defaultVariants: {
      shadow: "default",
    },
  },
);
