import { z } from "zod";

export const transactionSchema = z.object({
  amount: z
    .number({ required_error: "Jumlah wajib diisi" })
    .positive("Jumlah harus lebih dari 0"),
  type: z.enum(["income", "expense"], {
    required_error: "Tipe transaksi wajib dipilih",
  }),
  categoryId: z.string({ required_error: "Kategori wajib dipilih" }).min(1, "Pilih kategori"),
  date: z.string({ required_error: "Tanggal wajib diisi" }).min(1, "Pilih tanggal"),
  description: z.string(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
