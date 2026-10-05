# Hampir.Agency — Dokumentasi Redesign

Sumber kebenaran untuk redesign. Baca README ini dulu, lalu rujuk file spesifik saat mengerjakan.

| Dokumen | Isi |
|---|---|
| **README.md** (ini) | Ringkasan keputusan + PRD (tujuan, pengguna, fitur, ruang lingkup) |
| [architecture.md](./architecture.md) | Tech stack, struktur folder, rendering, **skema database**, **i18n ID/EN** |
| [design.md](./design.md) | **Design system** (warna light/dark, tipografi, komponen, motion) + **spesifikasi UI/UX tiap halaman** |
| [admin.md](./admin.md) | Fitur CMS + panduan ukuran foto |
| [security.md](./security.md) | Auth, hardening, env, checklist rilis + **data seed** |
| [rules.md](./rules.md) | Aturan wajib pengembangan |
| [roadmap.md](./roadmap.md) | Fase kerja & checklist |
| [../PROJECT_DOCUMENTATION.md](../PROJECT_DOCUMENTATION.md) | Analisis kondisi **sebelum** redesign (baseline/riwayat) |

## Ringkasan Keputusan Utama
- Light mode default + dark mode (toggle, tersimpan).
- Primary `#054697`; tanpa neon, glow, gradient teks, glassmorphism.
- Gaya solid clean / editorial; heading serif + body Inter.
- Dua bahasa ID/EN; admin dwibahasa untuk konten.
- Vercel Blob untuk gambar, hosting Vercel.
- Database dummy direset; seed disediakan.
- Auth aman, SEO per halaman, dashboard data nyata.

## Catatan
- Jangan commit `.env*` dan `memory/test_credentials.md`.

---
## Product Requirements Document (PRD)

### 1. Ringkasan
Website company profile **Hampir.Agency**, agensi digital full-service berbasis Batam, dengan CMS admin kustom. Menampilkan layanan, studi kasus, tim, dan menerima pesan calon klien. Konten dikelola tanpa merusak layout.

### 2. Tim Inti (4 peran)
1. Web Developer / UI-UX
2. Graphic Designer / Digital Marketing
3. Videographer / Photographer
4. Data Entry / Ops — pengguna utama admin

### 3. Tujuan
- Membangun kepercayaan (portfolio nyata, tim, proses kerja).
- Mengonversi pengunjung menjadi pesan/WhatsApp.
- Memudahkan Data Entry memperbarui konten sendiri (ID/EN).

### 4. Pengguna
| Pengguna | Kebutuhan |
|---|---|
| Calon klien (ID/EN) | Memahami layanan, melihat hasil kerja, menghubungi cepat |
| Admin / Data Entry | CRUD konten, upload gambar dengan panduan ukuran, baca pesan |

### 5. Fitur Publik
1. **Home** — Hero, ringkasan layanan (bento), portfolio pilihan, ringkas proses, CTA akhir.
2. **Services** — Daftar layanan detail, skalabel (mis. Interior Design nanti).
3. **Portfolio** — Grid dengan filter kategori dinamis.
4. **Case Study** — Challenge, Solution, Result, galeri, navigasi proyek berikutnya.
5. **About** — Misi, angka dampak, tim (dari DB), proses kerja.
6. **Contact** — Form + email + WhatsApp + lokasi.
7. **Theme toggle** (light default/dark) dan **language switch** (ID/EN).

### 6. Fitur Admin
1. Login aman.
2. Dashboard data nyata.
3. CRUD Services, Portfolio, Kategori Portfolio, Tim.
4. Messages (baca/unread/hapus).
5. Settings: logo, kontak (email, WA), sosial media, alamat.
6. Upload gambar dengan catatan ukuran di tiap input.

### 7. Non-Fungsional
- Lighthouse 90+, aksesibilitas WCAG AA (kontras, fokus terlihat, reduced motion).
- Responsif mobile-first.
- SEO per halaman (metadata, OG, hreflang, sitemap).
- Hosting Vercel + PostgreSQL + Vercel Blob.

### 8. Di Luar Lingkup (saat ini)
Blog, e-commerce, multi-user dengan role granular, analitik kustom, newsletter.

### 9. Kriteria Sukses
- Semua halaman tampil benar di light & dark, ID & EN.
- Data Entry dapat menambah portfolio lengkap tanpa bantuan developer.
- Tidak ada pemakaian warna neon/glow; palet sesuai design.md.