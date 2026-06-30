import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabVariants = {
  initial: { opacity: 0, x: 24, rotate: -1 },
  animate: { opacity: 1, x: 0, rotate: 0 },
  exit: { opacity: 0, x: -24, rotate: 1 },
};

interface PageTransitionProps {
  activeKey: string;
  children: ReactNode;
}

export function PageTransition({ activeKey, children }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeKey}
        variants={tabVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
