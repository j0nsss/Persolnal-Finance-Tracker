-- ============================================================
-- Seed data for NeoFin
-- Run AFTER registering a user (so auth.users has an entry)
-- Replace USER_UUID below with your actual auth.users id
-- ============================================================

-- Get your user UUID from: Auth > Users in Supabase Dashboard
-- Then run these inserts with that UUID

-- === Income ===
insert into public.transactions (user_id, amount, type, category_id, description, date) values
('USER_UUID', 8500000, 'income', 'salary', 'Gaji Januari',     (select date_trunc('month', now()) - interval '5 months' + interval '0 days')),
('USER_UUID', 500000, 'income', 'investment', 'Dividen saham', (select date_trunc('month', now()) - interval '5 months' + interval '14 days')),
('USER_UUID', 8500000, 'income', 'salary', 'Gaji Februari',   (select date_trunc('month', now()) - interval '4 months')),
('USER_UUID', 8500000, 'income', 'salary', 'Gaji Maret',      (select date_trunc('month', now()) - interval '3 months')),
('USER_UUID', 300000, 'income', 'investment', 'Bonus project', (select date_trunc('month', now()) - interval '3 months' + interval '9 days')),
('USER_UUID', 8750000, 'income', 'salary', 'Gaji April',      (select date_trunc('month', now()) - interval '2 months')),
('USER_UUID', 8750000, 'income', 'salary', 'Gaji Mei',        (select date_trunc('month', now()) - interval '1 month')),
('USER_UUID', 8750000, 'income', 'salary', 'Gaji Juni',       (select date_trunc('month', now()) - interval '0 months' + interval '0 days')),
('USER_UUID', 1200000, 'income', 'investment', 'THR',         (select date_trunc('month', now()) + interval '4 days'));

-- === Food ===
insert into public.transactions (user_id, amount, type, category_id, description, date) values
('USER_UUID', 45000, 'expense', 'food', 'Nasi goreng + es teh',                (select date_trunc('month', now()) - interval '5 months' + interval '2 days')),
('USER_UUID', 120000, 'expense', 'food', 'Makan malam di restoran',            (select date_trunc('month', now()) - interval '5 months' + interval '11 days')),
('USER_UUID', 35000, 'expense', 'food', 'Bakso dan minuman',                   (select date_trunc('month', now()) - interval '4 months' + interval '6 days')),
('USER_UUID', 250000, 'expense', 'food', 'Belanja mingguan supermarket',       (select date_trunc('month', now()) - interval '4 months' + interval '19 days')),
('USER_UUID', 55000, 'expense', 'food', 'Ayam geprek + minum',                 (select date_trunc('month', now()) - interval '3 months' + interval '4 days')),
('USER_UUID', 180000, 'expense', 'food', 'Makan malam bersama teman',          (select date_trunc('month', now()) - interval '3 months' + interval '17 days')),
('USER_UUID', 42000, 'expense', 'food', 'Sate padang',                         (select date_trunc('month', now()) - interval '2 months' + interval '7 days')),
('USER_UUID', 95000, 'expense', 'food', 'Bakmi + topping',                     (select date_trunc('month', now()) - interval '2 months' + interval '21 days')),
('USER_UUID', 38000, 'expense', 'food', 'Seblak',                              (select date_trunc('month', now()) - interval '1 month' + interval '3 days')),
('USER_UUID', 210000, 'expense', 'food', 'Belanja sembako',                    (select date_trunc('month', now()) - interval '1 month' + interval '14 days')),
('USER_UUID', 50000, 'expense', 'food', 'Makan siang warteg',                  (select date_trunc('month', now()) + interval '9 days'));

-- === Transport ===
insert into public.transactions (user_id, amount, type, category_id, description, date) values
('USER_UUID', 20000, 'expense', 'transport', 'Gojek ke kantor',                (select date_trunc('month', now()) - interval '5 months' + interval '9 days')),
('USER_UUID', 150000, 'expense', 'transport', 'Isi bensin motor',              (select date_trunc('month', now()) - interval '4 months' + interval '14 days')),
('USER_UUID', 25000, 'expense', 'transport', 'Transjakarta pulang-pergi',      (select date_trunc('month', now()) - interval '3 months' + interval '7 days')),
('USER_UUID', 160000, 'expense', 'transport', 'Isi bensin mobil',              (select date_trunc('month', now()) - interval '2 months' + interval '4 days')),
('USER_UUID', 30000, 'expense', 'transport', 'Grab ke mall',                   (select date_trunc('month', now()) - interval '1 month' + interval '11 days')),
('USER_UUID', 155000, 'expense', 'transport', 'Isi bensin motor',              (select date_trunc('month', now()) + interval '7 days'));

-- === Housing ===
insert into public.transactions (user_id, amount, type, category_id, description, date) values
('USER_UUID', 2500000, 'expense', 'housing', 'Sewa kos bulan Jan',             (select date_trunc('month', now()) - interval '5 months')),
('USER_UUID', 500000, 'expense', 'housing', 'Listrik',                         (select date_trunc('month', now()) - interval '5 months' + interval '4 days')),
('USER_UUID', 200000, 'expense', 'housing', 'Air PDAM',                        (select date_trunc('month', now()) - interval '5 months' + interval '9 days')),
('USER_UUID', 2500000, 'expense', 'housing', 'Sewa kos bulan Feb',             (select date_trunc('month', now()) - interval '4 months')),
('USER_UUID', 2500000, 'expense', 'housing', 'Sewa kos bulan Mar',             (select date_trunc('month', now()) - interval '3 months')),
('USER_UUID', 2500000, 'expense', 'housing', 'Sewa kos bulan Apr',             (select date_trunc('month', now()) - interval '2 months')),
('USER_UUID', 2500000, 'expense', 'housing', 'Sewa kos bulan Mei',             (select date_trunc('month', now()) - interval '1 month')),
('USER_UUID', 2500000, 'expense', 'housing', 'Sewa kos bulan Jun',             (select date_trunc('month', now())));

-- === Entertainment ===
insert into public.transactions (user_id, amount, type, category_id, description, date) values
('USER_UUID', 50000, 'expense', 'entertainment', 'Netflix subscription',        (select date_trunc('month', now()) - interval '5 months' + interval '19 days')),
('USER_UUID', 75000, 'expense', 'entertainment', 'Tiket bioskop',              (select date_trunc('month', now()) - interval '4 months' + interval '17 days')),
('USER_UUID', 50000, 'expense', 'entertainment', 'Spotify premium',            (select date_trunc('month', now()) - interval '3 months' + interval '21 days')),
('USER_UUID', 100000, 'expense', 'entertainment', 'Main futsal + sewa lapang', (select date_trunc('month', now()) - interval '2 months' + interval '13 days')),
('USER_UUID', 50000, 'expense', 'entertainment', 'Netflix subscription',        (select date_trunc('month', now()) - interval '1 month' + interval '24 days')),
('USER_UUID', 50000, 'expense', 'entertainment', 'Spotify premium',            (select date_trunc('month', now()) + interval '14 days'));

-- === Health ===
insert into public.transactions (user_id, amount, type, category_id, description, date) values
('USER_UUID', 150000, 'expense', 'health', 'Vitamin C + obat flu',             (select date_trunc('month', now()) - interval '5 months' + interval '7 days')),
('USER_UUID', 350000, 'expense', 'health', 'Cek kesehatan umum',               (select date_trunc('month', now()) - interval '3 months' + interval '11 days')),
('USER_UUID', 75000, 'expense', 'health', 'Obat maag',                         (select date_trunc('month', now()) - interval '1 month' + interval '19 days')),
('USER_UUID', 200000, 'expense', 'health', 'Konsultasi dokter gigi',           (select date_trunc('month', now()) + interval '2 days'));

-- === Shopping ===
insert into public.transactions (user_id, amount, type, category_id, description, date) values
('USER_UUID', 350000, 'expense', 'shopping', 'Beli kaos baru',                 (select date_trunc('month', now()) - interval '4 months' + interval '24 days')),
('USER_UUID', 180000, 'expense', 'shopping', 'Buku + alat tulis',              (select date_trunc('month', now()) - interval '3 months' + interval '27 days')),
('USER_UUID', 500000, 'expense', 'shopping', 'Sepatu olahraga',                (select date_trunc('month', now()) - interval '1 month' + interval '29 days')),
('USER_UUID', 120000, 'expense', 'shopping', 'Aksesoris HP',                   (select date_trunc('month', now()) + interval '11 days'));
