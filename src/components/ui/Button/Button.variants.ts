import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display font-bold rounded-brutal border-3 border-base-ink transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-accent-lime text-base-ink shadow-brutal hover:shadow-brutal-lg active:shadow-brutal-pressed",
        danger: "bg-feedback-danger text-white shadow-brutal hover:shadow-brutal-lg active:shadow-brutal-pressed",
        ghost: "bg-transparent shadow-none hover:bg-base-ink/5 active:bg-base-ink/10",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-7 py-3.5 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
