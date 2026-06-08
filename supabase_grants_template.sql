-- Template SQL untuk memberikan akses Data API pada tabel baru di Supabase
-- Berdasarkan kebijakan keamanan Supabase (berlaku mulai 30 Mei 2026 untuk proyek baru, dan 30 Okt 2026 untuk semua proyek).

-- CARA PENGGUNAAN:
-- 1. Ganti kata "nama_tabel_baru" dengan nama tabel yang Anda buat.
-- 2. Jalankan perintah ini di SQL Editor pada Dashboard Supabase Anda setiap kali selesai membuat tabel baru.

-- ============================================================================

-- 1. Memberikan akses baca (SELECT) ke pengguna anonim (belum login)
-- Hapus atau beri komentar pada baris ini jika tabel bersifat sangat rahasia.
GRANT SELECT ON public.nama_tabel_baru TO anon;

-- 2. Memberikan akses penuh (SELECT, INSERT, UPDATE, DELETE) ke pengguna yang sudah login (authenticated)
-- Sesuaikan izin di bawah (misalnya hapus DELETE jika user tidak boleh menghapus data).
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nama_tabel_baru TO authenticated;

-- 3. Memberikan akses penuh ke service_role (Admin/Server-side)
-- Wajib dijalankan agar API di server-side (seperti Next.js API Routes / Prisma) tetap memiliki akses penuh.
GRANT ALL ON public.nama_tabel_baru TO service_role;

-- ============================================================================
-- CATATAN TAMBAHAN (Row Level Security):
-- Setelah memberikan hak akses di atas, Anda tetap SANGAT DISARANKAN untuk mengaktifkan RLS (Row Level Security) 
-- pada tabel tersebut dan membuat kebijakannya (Policies).

-- Contoh mengaktifkan RLS:
-- ALTER TABLE public.nama_tabel_baru ENABLE ROW LEVEL SECURITY;
