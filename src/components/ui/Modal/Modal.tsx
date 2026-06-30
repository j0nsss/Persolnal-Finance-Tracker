import { type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onOpenChange, title, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-base-ink/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </Dialog.Overlay>
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <Dialog.Content asChild>
                <motion.div
                  className={cn(
                    "pointer-events-auto w-full max-w-lg mx-4",
                    "rounded-brutal border-3 border-base-ink bg-base-surface p-6 shadow-brutal-lg",
                    "focus:outline-none",
                    className,
                  )}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title className="font-display font-bold text-xl">
                      {title}
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        className="rounded-brutal border-3 border-base-ink p-1.5 hover:bg-base-ink/5 transition-colors"
                        aria-label="Close"
                      >
                        <X size={18} strokeWidth={2.5} />
                      </button>
                    </Dialog.Close>
                  </div>
                  {children}
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
