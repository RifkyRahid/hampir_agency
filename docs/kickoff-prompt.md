# Kickoff Prompt (salin ke agent/model)

```
Kamu akan mengerjakan REDESIGN website "Hampir.Agency" (agensi digital, Batam) di workspace ini.
Proyek yang ada adalah Next.js 15 + TypeScript + Tailwind + Prisma (PostgreSQL), dengan CMS admin kustom.

## LANGKAH 0 — BACA DULU (wajib, sebelum menulis kode apa pun)
Baca SELURUH dokumen berikut secara lengkap dan berurutan:
1. docs/README.md        → ringkasan keputusan + PRD
2. docs/rules.md         → aturan WAJIB (jangan dilanggar)
3. docs/architecture.md  → stack, struktur folder, skema DB dwibahasa, i18n
4. docs/design.md        → design system (warna light/dark, tipografi, komponen, motion) + spek UI/UX tiap halaman
5. docs/admin.md         → fitur CMS + panduan ukuran foto (wajib tampil di tiap input gambar)
6. docs/security.md      → auth, hardening, checklist rilis + data seed
7. docs/roadmap.md       → fase kerja & checklist
8. PROJECT_DOCUMENTATION.md → kondisi proyek SEBELUM redesign (baseline; hanya untuk konteks/riwayat)
Lalu pindai kode yang ada (app/, components/, lib/, prisma/, middleware.ts, next.config.js, package.json) agar paham kondisi sebenarnya.
JANGAN membuka atau mencetak isi file .env / .env.local / memory/test_credentials.md (berisi secret). Cukup tahu nama variabelnya.

## KEPUTUSAN YANG SUDAH FINAL (jangan diubah tanpa konfirmasi)
- Light mode DEFAULT, dark mode tersedia (toggle, tersimpan, tanpa flash).
- Warna utama biru #054697. DILARANG: neon, glow, blob blur, gradient teks, glassmorphism/backdrop-blur dekoratif, text-shadow.
- Gaya solid clean/editorial. Heading serif (Fraunces/Instrument Serif) + Inter untuk body.
- Dua bahasa ID (default) / EN, route /[locale]; admin UI berbahasa Indonesia, konten dwibahasa (tab ID|EN).
- Animasi hanya Framer Motion; hormati prefers-reduced-motion.
- Gambar tetap di Vercel Blob; hosting Vercel.
- Data DB lama adalah dummy → boleh direset. Sediakan seed (spesifikasi di docs/security.md bagian Seed Data).
- Perbaikan teknis ikut dikerjakan: auth aman (JWT bertanda tangan + bcrypt + requireAdmin() di semua server action), header keamanan, bersihkan sisa template, SEO per halaman, dashboard data nyata, kategori portfolio & tim dikelola dari admin.
- Cakupan: visual + layout ulang halaman; struktur fitur tetap.

## CARA KERJA
1. Setelah membaca semua dokumen, JANGAN langsung coding. Balas dulu dengan:
   a. Ringkasan pemahamanmu (maks ~15 baris): tujuan, keputusan final, urutan fase.
   b. Daftar ketidakjelasan, kontradiksi antar dokumen, atau asumsi yang kamu temukan.
   c. Rencana kerja Fase 0 & 1 (roadmap.md) yang konkret: file yang akan diubah/dibuat/dihapus, dependency yang akan ditambah/dihapus.
   Tunggu konfirmasi saya sebelum eksekusi.
2. Kerjakan BERTAHAP sesuai docs/roadmap.md. Satu fase selesai → berhenti, laporkan ringkas apa yang dikerjakan + cara mengeceknya, tunggu persetujuan sebelum fase berikutnya.
3. TANYA & MINTA KONFIRMASI SEBELUM bertindak jika:
   - Ada hal di luar scope dokumen (fitur baru, halaman baru, library baru yang tidak tercantum).
   - Ingin menyimpang dari keputusan final atau aturan di rules.md.
   - Ada konflik antara dokumen dan kode yang ada, atau dokumen ambigu.
   - Aksi destruktif/berisiko: menghapus file/folder, `prisma migrate reset`, mengubah data, mengubah konfigurasi produksi/deploy, menjalankan perintah yang berdampak ke luar mesin lokal.
   - Perlu nilai nyata yang belum ada (nomor WhatsApp, link sosial, foto tim, copy final) → pakai placeholder yang jelas bertanda dan beri tahu saya, jangan mengarang data klien.
   - Kamu ragu. Lebih baik bertanya daripada berasumsi.
4. Jangan: deploy, commit/push, mengunggah ke Vercel Blob, mengubah/menampilkan isi .env*, atau menambah dependency di luar yang tercantum di docs tanpa izin.
5. Jika perlu mengubah keputusan desain/arsitektur, perbarui dokumen terkait di docs/ pada perubahan yang sama (setelah saya setuju).

## STANDAR KUALITAS (cek sebelum menyatakan selesai)
- Tidak ada hex warna hardcode di komponen; pakai token (bg-background, text-foreground, bg-primary, dst).
- Tampil benar di: light & dark × ID & EN × mobile/tablet/desktop.
- Tidak ada teks hardcode di komponen (semua lewat kamus i18n atau kolom DB dwibahasa; fallback EN→ID).
- next/image, next/font, Server Components secara default, 'use client' hanya jika perlu.
- Validasi input dengan zod di server; semua aksi admin memanggil requireAdmin().
- Setiap input gambar di admin memakai komponen ImageField dengan catatan ukuran/rasio/format/maks file dari lib/image-specs.ts (satu sumber untuk UI dan validasi server).
- Jalankan `yarn build` (dan lint/typecheck bila ada) dan laporkan hasilnya jujur, termasuk error atau hal yang belum diverifikasi.
- Akses/aksesibilitas dasar: fokus terlihat, kontras AA, aria-label pada kontrol ikon.

## FORMAT LAPORAN TIAP FASE
- Yang dikerjakan (file/komponen)
- Cara mengecek (perintah + URL)
- Yang belum/di luar scope/butuh keputusan saya
- Pertanyaan (jika ada)

Mulai dari LANGKAH 0, lalu kirim ringkasan pemahaman + pertanyaan + rencana Fase 0–1. Jangan menulis kode sebelum saya konfirmasi.
```

## Tips
- Jalankan agent dengan workspace diarahkan ke folder proyek ini agar bisa membaca `docs/`.
- Jika model punya batas konteks kecil, minta ia membaca dokumen per fase (README + rules selalu, sisanya sesuai fase) dan tetap mengikuti prompt di atas.
- File ini boleh dihapus setelah proyek berjalan.
