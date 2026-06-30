import { type HTMLAttributes, forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../../lib/utils";
import { cardVariants } from "./Card.variants";

interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, keyof HTMLMotionProps<"div">>,
    HTMLMotionProps<"div"> {
  shadow?: "default" | "lg" | "none";
}

const cardMotion = {
  rest: { x: 0, y: 0, boxShadow: "6px 6px 0px #000000" },
  hover: { x: -3, y: -3, boxShadow: "9px 9px 0px #000000" },
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, shadow = "default", children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={cardMotion}
        initial="rest"
        whileHover="hover"
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(cardVariants({ shadow }), className)}
        {...(props as HTMLMotionProps<"div">)}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = "Card";
