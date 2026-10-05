# Design System & UI/UX

## 1. Prinsip
- **Light default**, dark tersedia. Keduanya setara kualitasnya.
- **Solid clean / editorial**: whitespace lega, tipografi sebagai elemen utama, border tipis.
- **Dilarang**: neon, glow, blob blur, grid overlay, gradient teks, glassmorphism/backdrop-blur dekoratif, `text-shadow`, scale hover berlebihan.
- Satu warna brand (biru), satu aksen hangat hemat.

## 2. Warna

| Token | Light | Dark | Pemakaian |
|---|---|---|---|
| `background` | `#F8FAFC` | `#0B1220` | Latar halaman |
| `card` / `popover` | `#FFFFFF` | `#111A2E` | Kartu, modal |
| `surface` (tint) | `#EEF3FA` | `#0F1829` | Section selang-seling |
| `foreground` | `#0F172A` | `#E6EDF7` | Teks utama |
| `muted-foreground` | `#64748B` | `#94A3B8` | Teks sekunder |
| `border` / `input` | `#E2E8F0` | `#1E2A44` | Garis |
| `primary` | `#054697` | `#4F8EDB` | CTA, link, fokus |
| `primary-foreground` | `#FFFFFF` | `#0B1220` | Teks di atas primary |
| `primary-soft` | `#E6EEF9` | `#16264A` | Chip/badge, ikon container |
| `accent` | `#B7791F` | `#E0A84B` | Highlight kecil (angka, label) — hemat |
| `destructive` | `#C2410C` | `#F08A5D` | Hapus/error |
| `success` | `#15803D` | `#4ADE80` | Status sukses |
| `ring` | `#054697` | `#4F8EDB` | Fokus (outline 2px, offset 2px) |

Kontras: primary `#054697` di putih ≈ 9:1; teks `muted-foreground` minimal 4.5:1 di latar masing-masing (verifikasi saat implementasi).

Implementasi: CSS variables HSL di `:root` (light) dan `.dark`; Tailwind membaca `hsl(var(--token))`. Tambah token `surface`, `primary-soft`, `accent`, `success`.

## 3. Tipografi
- **Heading**: serif display (Fraunces atau Instrument Serif), weight 500–600, `tracking-tight`, `text-balance`.
- **Body/UI**: Inter 400/500/600.
- **Mono** (label teknis, kecil): Geist Mono/JetBrains Mono, hanya untuk nomor & tag.

| Peran | Mobile → Desktop |
|---|---|
| Display (hero H1) | 40 → 72 px, leading 1.05 |
| H2 section | 30 → 44 px |
| H3 kartu | 20 → 24 px |
| Body | 16 → 18 px, leading 1.6 |
| Small/label | 12–14 px |

## 4. Layout & Spacing
- Container max 1200 px (konten) / 1400 px (lebar penuh), padding 20 → 32 px.
- Ritme vertikal section: 80 px mobile, 112–128 px desktop.
- Grid 12 kolom; bento 3 kolom di desktop.
- Radius: `sm 6`, `md 10`, `lg 14` (kartu), `full` (pill/tombol).

## 5. Elevasi
| Level | Light | Dark |
|---|---|---|
| Flat | border 1px | border 1px |
| Card hover | `0 6px 20px rgba(15,23,42,.08)` | border lebih terang |
| Modal | `0 20px 50px rgba(15,23,42,.15)` | `0 20px 50px rgba(0,0,0,.5)` |
Bayangan netral (tanpa warna brand).

## 6. Komponen

- **Button** — primary: bg `primary`, teks putih, hover gelapkan 8%. Secondary: border + teks foreground. Ghost: teks saja. Tinggi 44 px (touch), radius `full`. Fokus: ring 2px.
- **Card** — bg `card`, border, radius `lg`, padding 24. Hover: naikkan border/bayangan halus, **tanpa** scale.
- **Badge/Chip** — bg `primary-soft`, teks `primary`, radius `full`, 12–13 px.
- **Input** — border `input`, bg `card`, radius `md`, fokus: border `primary` + ring; error: border `destructive` + pesan.
- **Section header** — eyebrow (aksen/ primary, uppercase kecil) + H2 serif + deskripsi.
- **Nav** — sticky, bg `background` 90% + border bawah (tanpa blur); link aktif: garis bawah `primary`.
- **Tabel admin** — header muted, baris hover `surface`, aksi ikon.
- **Dialog** — overlay `foreground/40`, panel `card`, animasi fade+slide 8 px.
- **Toast** — sonner, ikuti tema.

## 7. Motion (Framer Motion)
- Durasi 0.25–0.5 s, easing `[0.22, 1, 0.36, 1]`; offset y maks 16 px.
- Entry `whileInView` sekali; stagger 0.06–0.1 s.
- Layout animation hanya untuk indikator aktif/filter.
- `prefers-reduced-motion`: nonaktifkan transform, sisakan fade.

## 8. Ikon & Gambar
- lucide-react stroke 1.5–2, ukuran 16/20/24.
- Gambar via `next/image`, `sizes` benar, placeholder warna `surface` saat kosong. Rasio baku: cover 16:9, tim 4:5, OG 1.91:1.

## 9. Aksesibilitas
- Fokus selalu terlihat; target sentuh ≥ 44 px.
- Kontras AA; jangan andalkan warna saja untuk status.
- HTML semantik (`header/nav/main/section/footer`), `aria-label` pada toggle tema/bahasa/menu.
- `lang` pada `<html>` sesuai locale.

---

## UI/UX Features — Spesifikasi per Halaman

Semua halaman: light default + dark, ID/EN, responsif, ikuti design.md. Teks diambil dari kamus i18n / data DB.

### Global

#### Navbar
- Kiri: logo (dari Settings; fallback teks "Hampir.Agency"). Tengah/kanan: Home, Services, Portfolio, About, Contact.
- Kanan: **LocaleSwitcher (ID | EN)**, **ThemeToggle** (matahari/bulan), CTA "Hubungi Kami / Let's Talk".
- Sticky, border bawah, link aktif bergaris bawah. Mobile: tombol menu → panel penuh dengan semua kontrol.

#### Footer
- Logo + tagline, nav, kontak (email, WA, alamat) dan sosial dari Settings, © dinamis. Link bahasa/tema opsional.

### 1. Home
1. **Hero** — eyebrow, H1 serif besar (tanpa gradient), subteks, CTA primer "Mulai Proyek" + sekunder "Lihat Karya". Opsional gambar/komposisi tipografis di kanan (desktop).
2. **Strip kepercayaan** — angka singkat (mis. 4 ahli, X proyek, kota).
3. **Layanan (bento)** — 3 kolom, kartu bervariasi ukuran, ikon + judul + deskripsi + link; dari DB (aktif).
4. **Karya Pilihan** — 3–4 portfolio `featured`, kartu gambar 16:9; link "Lihat semua".
5. **Proses kerja ringkas** — 4 langkah horizontal (Discovery, Design, Build, Deliver).
6. **CTA band** — blok `primary` solid, teks putih, tombol kontras.

### 2. Services
- Header halaman (judul + deskripsi).
- Daftar layanan baris selang-seling: nomor, judul, deskripsi, **daftar fitur** (bullets), CTA; sisi lain: panel visual (gambar/ikon besar pada `surface`).
- Sidebar indeks sticky di desktop (anchor tiap layanan) dengan penanda aktif saat scroll.
- Penutup: CTA band.
- Skalabel: layanan baru dari admin otomatis tampil.

### 3. Portfolio
- Header + **FilterBar** kategori dinamis (dari DB) berupa pill; "Semua" default; filter via query `?kategori=` agar bisa dibagikan.
- Grid 3 kolom (2 tablet, 1 mobile) kartu seragam 16:9; info (judul, kategori, tahun) tampil **di bawah gambar** (tidak hanya saat hover agar ramah mobile).
- Empty state jika kategori kosong.

### 4. Case Study (`/portfolio/[slug]`)
- Breadcrumb/kembali, kategori · tahun, H1, ringkasan.
- Hero image 16:9.
- Meta (Client, Disiplin/Layanan, Tim, Link proyek) — sidebar sticky desktop, blok di atas konten pada mobile.
- Bagian **Tantangan / Solusi / Hasil** (tampil jika terisi).
- Galeri (grid 2 kolom, lightbox opsional).
- "Proyek berikutnya" (melingkar) + kembali ke daftar.
- Metadata & OG per proyek (cover sebagai og:image).

### 5. About
1. Hero statement (H1 serif) + misi.
2. **Angka dampak** (dari Settings/kamus).
3. **Tim** — grid 2×2 (4 inti) dari DB: foto 4:5, nama, peran, skill chips; foto grayscale→warna saat hover (opsional, tanpa scale).
4. **Proses kerja** — timeline vertikal garis tipis (tanpa glow), 4–5 langkah.
5. Nilai/prinsip (3 poin) + CTA band.

### 6. Contact
- Split 2 kolom. Kiri: H1, janji respons 24 jam (ID: "dalam 1×24 jam"), email, tombol WhatsApp, alamat Batam + peta statis/koordinat teks, jam kerja.
- Kanan: form kartu (Nama, Email, Pesan; opsional Layanan yang diminati & Telepon). Validasi zod, pesan error per field, honeypot anti-spam + rate limit, status loading, toast/state sukses dengan opsi "Kirim lagi".

### 7. 404 / Error
Halaman 404 ramah (dwibahasa) dengan tautan ke Home & Portfolio.

### 8. Admin (ringkas — detail di admin.md)
Sidebar + topbar (tema toggle, user), dashboard kartu statistik + aktivitas, tabel dengan cari/filter, form per seksi dengan tab ID|EN, dialog konfirmasi, toast.

### Perilaku Lintas Halaman
| Perilaku | Aturan |
|---|---|
| Tema | Light saat pertama buka; pilihan tersimpan (localStorage); tanpa flash |
| Bahasa | Prefix URL `/id` `/en`; switcher mempertahankan halaman; `hreflang` |
| Loading | Skeleton untuk grid/daftar; tombol disabled + spinner saat submit |
| Empty/error | Pesan jelas + aksi lanjutan |
| Motion | Halus, mengikuti reduced-motion |
| SEO | Title/description/OG per halaman & per bahasa, `sitemap.xml`, `robots.txt` |
