import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "../../../components/ui/Modal/Modal";
import { Input } from "../../../components/ui/Input/Input";
import { Select } from "../../../components/ui/Select/Select";
import { Button } from "../../../components/ui/Button/Button";
import { CATEGORY_LIST } from "../../../lib/constants";
import { formatRupiah } from "../../../lib/utils";
import { transactionSchema, type TransactionFormValues } from "./transactionSchema";
import type { NewTransactionInput } from "../../../types/transaction";

interface TransactionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewTransactionInput) => Promise<void>;
}

const typeOptions = [
  { value: "expense", label: "Pengeluaran" },
  { value: "income", label: "Pemasukan" },
];

const shakeVariants = {
  shake: {
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.3 },
  },
};

export function TransactionFormModal({ open, onOpenChange, onSubmit }: TransactionFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: undefined,
      type: "expense",
      categoryId: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    },
  });

  const transactionType = watch("type");

  const categoryOptions = CATEGORY_LIST
    .filter((cat) => cat.type === "both" || cat.type === transactionType)
    .map((cat) => ({ value: cat.id, label: cat.label }));

  const handleFormSubmit = async (values: TransactionFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        amount: values.amount,
        type: values.type,
        categoryId: values.categoryId as NewTransactionInput["categoryId"],
        date: values.date,
        description: values.description,
      });
      reset();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  const accentBorder = transactionType === "income" ? "border-accent-lime" : "border-accent-pink";

  return (
    <Modal open={open} onOpenChange={handleOpenChange} title={transactionType === "income" ? "Tambah Pemasukan" : "Tambah Pengeluaran"}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={transactionType}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="flex rounded-brutal border-3 border-base-ink overflow-hidden">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={`flex-1 py-2.5 font-display font-bold text-sm transition-colors ${
                        field.value === opt.value
                          ? opt.value === "income"
                            ? "bg-accent-lime text-base-ink"
                            : "bg-accent-pink text-white"
                          : "bg-base-surface text-base-ink/60 hover:bg-base-ink/5"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            />
          </motion.div>
        </AnimatePresence>

        <motion.div variants={shakeVariants} animate={errors.amount ? "shake" : ""}>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Jumlah (Rp)"
                className={`font-mono ${accentBorder}`}
                error={errors.amount?.message}
                value={field.value ? formatRupiah(field.value) : ""}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  field.onChange(digits ? Number(digits) : undefined);
                }}
              />
            )}
          />
        </motion.div>

        <div>
          <Select
            options={categoryOptions}
            placeholder="Pilih kategori"
            error={errors.categoryId?.message}
            {...register("categoryId")}
          />
        </div>

        <div>
          <Input
            type="date"
            error={errors.date?.message}
            {...register("date")}
          />
        </div>

        <div>
          <Input
            placeholder="Deskripsi (opsional)"
            {...register("description")}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="md"
            className="flex-1"
            onClick={() => handleOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
