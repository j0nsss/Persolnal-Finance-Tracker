import { type ButtonHTMLAttributes, forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../../lib/utils";
import { buttonVariants } from "./Button.variants";

const buttonMotion = {
  rest: { x: 0, y: 0, boxShadow: "4px 4px 0px #000000" },
  hover: { x: -1, y: -1, boxShadow: "5px 5px 0px #000000" },
  tap: { x: 2, y: 2, boxShadow: "1px 1px 0px #000000" },
};

const dangerMotion = {
  rest: { x: 0, y: 0, boxShadow: "4px 4px 0px #000000" },
  hover: { x: -1, y: -1, boxShadow: "5px 5px 0px #000000" },
  tap: { x: 2, y: 2, boxShadow: "1px 1px 0px #000000" },
};

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">>,
    HTMLMotionProps<"button"> {
  variant?: "primary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const motionVariant = variant === "danger" ? dangerMotion : buttonMotion;

    return (
      <motion.button
        ref={ref}
        variants={motionVariant}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className={cn(buttonVariants({ variant, size }), className)}
        {...(props as HTMLMotionProps<"button">)}
      >
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
