import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";

const toastMotion = {
  initial: { x: 100, opacity: 0, rotate: 4 },
  animate: { x: 0, opacity: 1, rotate: -2 },
  exit: { x: 100, opacity: 0, rotate: 4, transition: { duration: 0.15 } },
};

type ToastVariant = "success" | "error" | "info";

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-accent-lime text-base-ink",
  error: "bg-feedback-danger text-white",
  info: "bg-base-surface text-base-ink",
};

interface ToastProps {
  open: boolean;
  onClose: () => void;
  variant?: ToastVariant;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function Toast({
  open,
  onClose,
  variant = "info",
  title,
  description,
  children,
}: ToastProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={toastMotion}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={cn(
            "fixed bottom-4 right-4 z-[100] w-full max-w-sm rounded-brutal border-3 border-base-ink shadow-brutal-lg p-4",
            variantStyles[variant],
          )}
          role="alert"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="font-display font-bold text-base">{title}</p>
              {description && (
                <p className="font-body text-sm mt-1 opacity-80">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-brutal border-2 border-base-ink p-1 hover:opacity-80 transition-opacity"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </button>
          </div>
          <div className="mt-3 h-1 w-full rounded-full bg-base-ink/20 overflow-hidden">
            <motion.div
              className="h-full bg-base-ink"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3.5, ease: "linear" }}
              onAnimationComplete={onClose}
            />
          </div>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
