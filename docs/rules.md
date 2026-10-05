# Development Rules

Aturan wajib untuk siapa pun (manusia/AI) yang mengerjakan proyek ini.

## Stack
1. Next.js App Router + TypeScript + Tailwind + Prisma (PostgreSQL). **Tanpa Express.** Backend = Server Actions / Route Handlers.
2. Hosting **Vercel**; gambar di **Vercel Blob**. (Aturan lama soal VPS/Nginx dicabut.)
3. Animasi **hanya Framer Motion**. Dilarang GSAP/anime.js.

## Desain
4. Gunakan **token** warna (`bg-background`, `text-foreground`, `bg-primary`, dst). **Dilarang hardcode hex** di komponen.
5. **Dilarang**: neon, glow (`shadow` berwarna/blur blob), gradient teks, glassmorphism/`backdrop-blur` dekoratif, `text-shadow`, grid overlay dekoratif.
6. Setiap komponen harus bagus di **light dan dark**; uji keduanya.
7. Light adalah default; jangan hardcode `class="dark"`.
8. Hormati `prefers-reduced-motion`.

## i18n
9. Tidak ada teks hardcode di komponen; semua lewat kamus atau kolom DB dwibahasa.
10. Semua link internal menyertakan prefix locale.

## Kualitas Kode
11. Gambar wajib `next/image`; `next/font/google` untuk font; `next/dynamic` untuk komponen berat.
12. Server Components secara default; `'use client'` hanya jika perlu interaksi.
13. Validasi input dengan zod di **server**; jangan percaya klien.
14. Semua aksi admin memanggil `requireAdmin()` di awal.
15. Jangan `dangerouslySetInnerHTML` untuk konten user.
16. HTML semantik, a11y: fokus terlihat, label form, `aria-label` untuk kontrol ikon.
17. Target Lighthouse ≥ 90.

## Data & Upload
18. Teks dwibahasa disimpan di kolom `xxxId/xxxEn`; akses lewat helper dengan fallback.
19. Spesifikasi gambar hanya didefinisikan di `lib/image-specs.ts` (dipakai UI dan server). Setiap input gambar **wajib** menampilkan catatan ukuran.
20. Jangan mengunggah ke Blob dari seed.

## Keamanan & Repo
21. Jangan commit `.env*` atau kredensial; `memory/test_credentials.md` di-ignore.
22. Jangan menambah dependency tanpa alasan; hapus yang tak dipakai.
23. Jangan men-deploy atau mengubah konfigurasi produksi tanpa izin pemilik proyek.

## Proses
24. Kerjakan sesuai [roadmap.md](./roadmap.md); satu fase selesai & di-review sebelum lanjut.
25. Perubahan keputusan desain/arsitektur → perbarui dokumen terkait di `docs/` pada commit yang sama.
