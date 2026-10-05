# Hampir.Agency — Dokumentasi Proyek (Baseline untuk Redesign)

> Dokumen ini dibuat dari analisis kode sumber (bukan asumsi). Gunakan sebagai referensi saat redesign.
> File `.env` / `.env.local` **sengaja tidak dibaca/dicatat isinya** (berisi secret).

---

## 1. Ringkasan

| Item | Detail |
|---|---|
| Nama brand | **Hampir.Agency** (admin: "Hampir.Admin") |
| Jenis | Website company profile agensi digital full-service + Admin Dashboard (CMS) |
| Lokasi agensi | Batam, Indonesia (koordinat dekoratif `1.0456° N, 104.0305° E`) |
| Email kontak | hampiragency@gmail.com |
| WhatsApp | `https://wa.me/6281234567890` (**placeholder**) |
| Tim inti (4 peran) | Web Developer/UI-UX · Graphic Designer/Digital Marketing · Videographer/Photographer · Data Entry/Ops |
| Bahasa UI | Inggris |
| Target deploy | VPS pribadi + Nginx, `npm run build && npm run start` (lihat `docs/rules.md`) |

---

## 2. Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js **15.5** (App Router), React **18.3**, TypeScript 5.7 |
| Styling | Tailwind CSS **3.4.1** + `tailwindcss-animate`, CSS variables (HSL) ala shadcn/ui |
| UI primitives | Radix UI + komponen shadcn di `components/ui/*` (`.jsx`, sebagian besar belum dipakai) |
| Animasi | **Hanya Framer Motion 11** (aturan proyek: dilarang GSAP/anime.js) |
| Ikon | `lucide-react` |
| Font | **Inter** via `next/font/google` |
| Database | PostgreSQL + **Prisma 6** |
| Backend | Server Actions + Server Components (tanpa Express/API route) |
| Upload gambar | `@vercel/blob` (`access: 'public'`); versi lokal `public/uploads` ada tapi di-comment |
| Lainnya (terpasang) | react-hook-form, zod, swr, tanstack query/table, recharts, sonner, date-fns — mayoritas **belum dipakai** |
| Package manager | Yarn 1.22 |
| Output build | `output: 'standalone'`, `images.unoptimized: true` |

### Aturan proyek (`docs/rules.md`)
1. Wajib Next.js App Router + TS + Tailwind + Prisma/PostgreSQL, tanpa Express.
2. Hanya Framer Motion untuk animasi.
3. Wajib `next/image` (dilarang `<img>`), `next/font/google`, `next/dynamic` untuk komponen berat.
4. Target Lighthouse 90+, HTML semantik.
5. Jangan deploy ke emergent.sh/cloud; konfigurasi lewat `.env`.

---

## 3. Struktur Folder

```
app/
  layout.tsx            Root layout (Inter, class "dark", Providers)
  globals.css           Token warna (CSS variables)
  providers.tsx
  (public)/             Route group situs publik
    layout.tsx          Navbar + Footer (+ getSettings untuk logo)
    page.tsx            Home
    about/page.tsx
    services/page.tsx
    portfolio/page.tsx
    portfolio/[slug]/page.tsx   Detail case study
    contact/page.tsx + actions.ts
  admin/
    layout.tsx          Sidebar admin (client)
    page.tsx            Dashboard
    login/page.tsx
    services|portfolio|messages|settings/  (page.tsx + actions.ts)
    actions.ts          login/logout
    upload.ts           Upload gambar ke Vercel Blob
components/
  Navbar.tsx, Footer.tsx
  home/ (Hero, BentoServices)
  public/ (ServicesSections, PortfolioGallery)
  admin/ (ServicesManager, PortfolioManager, MessagesManager, SettingsManager)
  ui/                   shadcn (tidak dominan dipakai)
lib/ data.ts (query publik), prisma.ts, utils.js
prisma/ schema.prisma, seed.mjs
middleware.ts           Proteksi /admin/*
docs/ & MD/             PRD, design, architecture, schema, rules (duplikat)
```

---

## 4. Sitemap & Fitur Halaman Publik

Navigasi: **Home · Services · Portfolio · About · Contact** + CTA "Let's Talk" (→ /contact). Navbar sticky, blur, pill aktif beranimasi (`layoutId`), menu mobile collapse.

### 4.1 Home `/` (dynamic, `force-dynamic`)
- **Hero**: badge "Premium Full-Service Digital Agency", H1 "We craft *pixel-perfect* digital experiences." (kata kunci gradient hijau→cyan), subteks, 2 CTA: **Start a Project** (primary) & **View Our Work** (outline). Latar: 3 blob glow radial + grid overlay opacity 4%. Animasi stagger fade-up.
- **BentoServices** ("What we do — A full-service toolkit"): grid 3 kolom, `auto-rows-[240px]`, pola span `2-1-1-2`, kartu `rounded-3xl` glass, hover scale 1.02 + glow + panah. Data dari DB (`isActive`), fallback mock 4 layanan jika kosong.
- *(PRD menyebut "portfolio glimpses" di Home — **belum diimplementasi**.)*

### 4.2 Services `/services`
- Hero judul "Everything you need, *under one roof*".
- Baris **alternating** (kiri/kanan bergantian), nomor `01 · Tagline`, judul, deskripsi, daftar fitur (ceklis), link "Start a project", panel visual berisi ikon besar + glow + grid.
- Data DB → hanya title/description/icon (tagline = "Service", features kosong); fallback mock memiliki features.
- *(Desain awal minta "sticky scroll index" — belum ada.)*

### 4.3 Portfolio `/portfolio`
- Masonry (CSS columns 1/2/3), filter pill sticky: **All / Web / Design / Video** (hardcoded), animasi layout.
- Kartu: gambar (aspect 4/5 atau 4/3 bergantian), badge kategori; saat hover panel glass slide-up (kategori, judul, deskripsi, tag).
- Tanpa gambar → placeholder gradient + ikon kategori.

### 4.4 Case Study `/portfolio/[slug]`
- Back link, meta (kategori / tahun), judul, deskripsi, hero image 16:9.
- Sidebar sticky: Client, Discipline (service/kategori), Team (chip, dipisah koma), "Visit live project".
- Konten: **The Challenge / Solution & Process / The Result** (tampil jika terisi), Project Gallery (masonry 2 kolom), navigasi "Next Project" (melingkar).

### 4.5 About `/about` (client, **data mock di kode**)
- Hero statement "We build digital experiences that *matter*."
- Impact bar 3 stat: `4 Core Experts`, `Full-Service Agency`, `Batam Based`.
- Meet the Team: grid 2×2, avatar inisial grayscale → warna saat hover, nama, peran, skill chip. (Nama mock: Rifky Rahid, Anisa Putri, Bagas Pratama, Dewi Lestari.)
- *(Bagian "Our Process" timeline & mission di PRD/desain — **belum ada**.)*

### 4.6 Contact `/contact`
- Split 50/50. Kiri: badge, H1 "Let's build something *great*.", janji balasan 24 jam, email, tombol Direct WhatsApp, koordinat + "Batam, Indonesia" dengan text-glow.
- Kanan: form glass (Name, Email, Message), input glow hijau saat fokus, state loading/error/sukses ("Message sent!" + "Send another").
- Server action `createMessage` → validasi non-kosong → simpan `ContactMessage`.

### 4.7 Footer
Logo + tagline, link nav, 4 ikon sosial (GitHub/Twitter/Instagram/LinkedIn — href `#` placeholder), © tahun dinamis, koordinat mono hijau.

### Logo
Dikelola dari admin Settings (header & footer). Fallback: ikon Hexagon + teks "Hampir.Agency".

---

## 5. Admin Dashboard `/admin/*`

| Menu | Fungsi |
|---|---|
| **Login** `/admin/login` | Email + password → cookie `admin_session` |
| **Dashboard** | 3 stat card (Total Services, Total Portfolios, Unread Messages) + Recent activity — **saat ini angka MOCK** |
| **Services** | Tabel + modal CRUD: title, description, icon (identifier `code/palette/camera/database/home` atau URL), isActive |
| **Portfolio** | Tabel + modal CRUD: title, slug (opsional, auto), description, category (Web/Design/Video), year, related service, client, team, challenge, solution, result, link, **cover (wajib)**, **gallery multi-upload** |
| **Messages** | Daftar pesan, badge Unread, Mark Read/Unread, hapus |
| **Settings** | Upload/hapus logo header & footer (saran ~400×120px, SVG/PNG transparan) |

UI admin: sidebar fixed 256px (desktop), drawer di mobile, item aktif pill hijau animasi, tombol Logout.

---

## 6. Alur Kerja (Workflow)

**Pengunjung**
```
Home → Services / Portfolio → Case Study → Contact (form) → pesan tersimpan di DB
```

**Admin (Data Entry)**
```
/admin/login → middleware cek cookie → Dashboard
  ├ Services  : tambah/ubah/hapus/nonaktifkan → tampil di Home & Services
  ├ Portfolio : upload cover+gallery (Vercel Blob) → isi case study → tampil di /portfolio & /portfolio/[slug]
  ├ Messages  : baca & kelola pesan dari form Contact
  └ Settings  : ganti logo → Navbar/Footer
```

**Autentikasi**: `middleware.ts` matcher `/admin/:path*` — tanpa cookie → redirect ke login; sudah login → `/admin/login` redirect ke `/admin`. Credential dari `ADMIN_EMAIL` / `ADMIN_PASSWORD` (default fallback di kode). Cookie httpOnly, sameSite lax, 7 hari.

**Data publik** (`lib/data.ts`): semua query dibungkus try/catch, mengembalikan kosong saat DB error → komponen jatuh ke data mock.

---

## 7. Skema Database (Prisma / PostgreSQL)

| Model | Field |
|---|---|
| `User` | id (uuid), email (unique), password, role (default `ADMIN`), createdAt — **belum dipakai login** |
| `Service` | id, title, description, icon?, isActive (true), createdAt, updatedAt, relasi `portfolios[]` |
| `Portfolio` | id, title, slug (unique), description, imageUrl, gallery `String[]`, link?, category, year?, challenge?, solution?, result?, client?, team?, serviceId? → Service, createdAt |
| `SiteSettings` | id (`"singleton"`), headerLogo?, footerLogo?, updatedAt |
| `ContactMessage` | id, name, email, message, isRead (false), createdAt |

Env yang dipakai (nama saja): `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_BASE_URL`, `CORS_ORIGINS`, token Vercel Blob (`BLOB_READ_WRITE_TOKEN`).

---

## 8. Design System

### 8.1 Karakter
Premium, futuristik, bersih "pixel-perfect"; **glassmorphism** + garis tipis + aksen glow neon. **Dark mode only** (`<html class="dark">`), background bukan hitam murni.

### 8.2 Palet Warna

| Token | HSL | Hex | Fungsi |
|---|---|---|---|
| `--background` | 210 27% 6% | **#0B0F13** | Latar halaman |
| `--foreground` | 0 0% 100% | #FFFFFF | Teks utama |
| `--card` / `--popover` | 217 22% 12% | ≈ #181D25 | Permukaan kartu (dipakai `/40` opacity + blur) |
| `--secondary` / `--muted` | 217 22% 16% | ≈ #20262F | Permukaan sekunder, placeholder |
| `--muted-foreground` | 215 20% 65% | **#94A3B8** | Teks sekunder |
| `--primary` | 151 100% 45% | **#00E676** | Neon green — CTA, aksen, ring, glow |
| `--primary-foreground` | 210 27% 6% | #0B0F13 | Teks di atas primary |
| `--accent` | 187 85% 53% | **#22D3EE** | Cyan — gradient & blob glow |
| `--destructive` | 0 72% 51% | ≈ #DC2626 | Error / hapus |
| `--border` / `--input` | 215 25% 27% | **#334155** | Garis tipis (dipakai `/60`–`/70`) |
| `--ring` | = primary | #00E676 | Fokus |
| chart 1–5 | — | #00E676, #22D3EE, hsl(217 91% 60%) biru, hsl(43 74% 66%) kuning, hsl(280 65% 60%) ungu | Chart (belum dipakai) |
| sidebar-bg | 210 27% 8% | ≈ #0E1318 | Sidebar |

> Catatan: `body` juga di-hardcode `background-color: #0b0f13`. Blok `:root` dan `.dark` identik.

**Gradient teks khas**: `from-primary (via-primary) to-accent` + `bg-clip-text`.
**Glow tombol**: `shadow-[0_0_28px_-6px_hsl(var(--primary))]`.

### 8.3 Tipografi
Inter (latin, swap). Pola: H1 `text-4xl → sm:6xl → md:7xl`, `font-semibold`, `leading-[1.05–1.08]`, `tracking-tight`, `text-balance`. Section H2 `text-3xl/4xl`. Label eyebrow: `text-sm text-primary`. Label teknis: **font-mono, uppercase, tracking-widest, text-primary/70** (tag, nomor, koordinat).

### 8.4 Komponen & Pola Visual
- **Kartu**: `rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl`, blob glow primary di pojok yang muncul saat hover + `ring-primary/30`.
- **Badge/pill**: `rounded-full border-border/70 bg-card/50 backdrop-blur-md text-xs`.
- **Tombol primary**: `rounded-full bg-primary` + glow + `hover:scale-[1.03]`. Sekunder: outline glass.
- **Ikon container**: `h-12 w-12 rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/25`.
- **Input**: `rounded-2xl/xl border-border/70 bg-background/40`, fokus → border primary + glow ring.
- **Latar section**: blob blur besar (`blur-[120–140px]`) primary & accent + grid garis putih opacity 4–5% (64px/40px).
- **Container**: center, padding 2rem, max 1400px (2xl). `--radius: 0.75rem`.
- **Modal admin**: `rounded-3xl bg-card/95 backdrop-blur-xl`, overlay `bg-background/70 blur-sm`, animasi spring.

### 8.5 Animasi (Framer Motion)
- Easing kustom `[0.21, 0.47, 0.32, 0.98]`, durasi 0.5–0.7s.
- Entry: fade-up `y:24`, stagger 0.1–0.15s; `whileInView` dengan `once: true`.
- Hover kartu: spring scale 1.02–1.03.
- Pill aktif navbar/filter/admin: shared `layoutId` + spring (stiffness 380, damping 30).
- Menu mobile: height auto; drawer admin: slide-x spring.

### 8.6 Responsif
Mobile-first; bento & grid menjadi 1 kolom di mobile, `md` breakpoint untuk 2–3 kolom; navbar collapse < `md`; admin sidebar → drawer < `md`.

---

## 9. Gap: Spesifikasi (PRD/Design) vs Implementasi Saat Ini

| Area | Rencana | Status |
|---|---|---|
| Home — portfolio glimpses | Ada | ❌ belum |
| About — Our Process timeline, mission | Ada | ❌ belum |
| About — tim dari DB / foto sungguhan | Ada | ⚠️ mock + inisial |
| Services — sticky scroll index | Ada | ⚠️ alternating rows saja |
| Services — features/tagline dari DB | — | ⚠️ tidak ada field di skema |
| Dashboard admin | Angka nyata | ⚠️ masih mock |
| Login via model `User` + hash password | Ada | ⚠️ pakai env statis |
| Filter portfolio dinamis | — | ⚠️ hardcoded 3 kategori |
| Sosial media footer, nomor WA | Nyata | ⚠️ placeholder |
| Portfolio klien nyata (Mecca Madina, RAM HRMS) | — | ⚠️ hanya mock saat DB kosong |

## 10. Catatan Teknis & Risiko (perlu ditangani saat redesign/produksi)

1. **Keamanan sesi**: cookie `admin_session` bernilai konstan `'authenticated'` (tidak ditandatangani) — siapa pun bisa memalsukan. Ganti ke session/JWT bertanda tangan atau NextAuth, dan verifikasi di dalam setiap server action admin (belum diverifikasi di analisis ini).
2. **Password default** (`admin123`, `admin@hampir.agency`) jika env tidak di-set; `memory/test_credentials.md` kemungkinan berisi kredensial — jangan di-commit.
3. **`next.config.js`**: header `X-Frame-Options: ALLOWALL`, CSP `frame-ancestors *`, CORS `*` — sisa konfigurasi preview Emergent; perketat untuk produksi.
4. **Sisa template**: `package.json` bernama `nextjs-mongo-template`, ada dependency `mongodb` + `serverExternalPackages: ['mongodb']`, folder `.emergent`, `.vercel` — bisa dibersihkan.
5. **Upload**: memakai Vercel Blob (bertentangan dengan rencana VPS lokal di `rules.md`); `remotePatterns` hanya `*.public.blob.vercel-storage.com`. Pengecekan `hasImage` masih mengenali `/uploads` (legacy). Pilih satu strategi penyimpanan.
6. `images.unoptimized: true` → optimasi `next/image` dimatikan.
7. Dokumen ganda: `docs/` dan `MD/` berisi file sama.
8. Banyak komponen `components/ui/*` & dependency tidak terpakai (bundle/maintenance).
9. Validasi form masih minimal (tanpa format email, rate-limit/anti-spam); zod & react-hook-form tersedia untuk dipakai.
10. SEO: metadata hanya di root layout; belum ada per-page metadata, OG image, sitemap/robots.

## 11. Rekomendasi untuk Redesign
- **Pertahankan**: identitas dark + neon green/cyan, glassmorphism, Bento, animasi Framer Motion, struktur CMS admin & skema Prisma.
- **Putuskan dulu**: (a) tetap dark-only atau tambah light mode; (b) apakah palet neon dipertahankan atau diganti; (c) strategi storage gambar; (d) apakah tim/process/statistik dikelola dari admin.
- **Tambahkan**: section portfolio di Home, Our Process, testimoni/CTA akhir, per-page SEO, dashboard dengan data nyata, auth aman, kategori portfolio dinamis dari DB.

---
*Dibuat: 2026-10-05 · Sumber: `docs/*.md`, `prisma/schema.prisma`, `app/**`, `components/**`, `tailwind.config.js`, `app/globals.css`, `next.config.js`, `middleware.ts`.*


---

# 12. Keputusan Redesign (disepakati 2026-10-05)

## 12.1 Cakupan
- Redesign **visual + layout ulang halaman**; struktur fitur dan skema data tetap.
- Perbaikan teknis ikut dikerjakan: auth aman (sesi bertanda tangan + verifikasi di semua server action admin, login via model `User` dengan hash), header keamanan diperketat, sisa template dibersihkan (mongodb, `.emergent`, nama paket, `MD/` duplikat), SEO per halaman (metadata, OG, sitemap, robots), dashboard admin berdata nyata, kategori portfolio dinamis.
- Bahasa: **dua bahasa ID/EN** (perlu routing i18n, mis. `/id` dan `/en`, kamus terjemahan, dan field konten dwibahasa untuk Service/Portfolio di skema).

## 12.2 Tema
- **Light mode default**, dark mode tersedia lewat toggle; pilihan disimpan (`next-themes`, `defaultTheme="light"`, `enableSystem={false}`).
- **Dilarang**: warna neon, glow (`shadow` berwarna/blur blob), gradient teks, glassmorphism/backdrop-blur dekoratif.

## 12.3 Palet Baru

| Token | Light (default) | Dark |
|---|---|---|
| background | `#F8FAFC` | `#0B1220` |
| card / surface | `#FFFFFF` | `#111A2E` |
| surface tint (section) | `#EEF3FA` | `#0F1829` |
| foreground | `#0F172A` | `#E6EDF7` |
| muted-foreground | `#64748B` | `#94A3B8` |
| border | `#E2E8F0` | `#1E2A44` |
| **primary** | **`#054697`** | `#4F8EDB` |
| primary-foreground | `#FFFFFF` | `#0B1220` |
| accent hangat (hemat, highlight kecil) | `#B7791F` | `#E0A84B` |
| destructive | `#C2410C` | `#F08A5D` |
| ring (fokus) | `#054697` | `#4F8EDB` |

Catatan: kontras `#054697` di atas putih ≈ 9:1 (lolos AAA teks normal). Di dark mode primary dibuat lebih terang agar terbaca.

## 12.4 Gaya Visual
- **Solid clean / editorial**: kartu putih solid, border 1px tipis, bayangan sangat halus (`0 1px 2px` – `0 8px 24px` opacity rendah), radius sedang (`rounded-2xl`, bukan `3xl` di mana-mana).
- Tombol datar solid (primary), sekunder outline; hover = perubahan warna/underline, tanpa scale-glow.
- Tidak ada blob blur, grid overlay, atau text-shadow. Pemisah section lewat selang-seling `background` / `surface tint`.
- Animasi tetap Framer Motion, lebih halus (fade/slide pendek, tanpa spring berlebihan); hormati `prefers-reduced-motion`.

## 12.5 Tipografi
- Heading: font **serif/display modern** (kandidat: Fraunces atau Instrument Serif) via `next/font/google`.
- Body/UI: **Inter**. Label teknis kecil boleh pakai mono secukupnya.

## 12.6 Penyimpanan Gambar
- **Tetap Vercel Blob**, hosting tetap di Vercel. Aturan di `docs/rules.md` soal VPS/Nginx perlu diperbarui.
- Hapus kode upload lokal yang di-comment dan dukungan path `/uploads`.
- Sesuaikan `output: 'standalone'` (tidak perlu di Vercel) dan pertimbangkan mengaktifkan optimasi `next/image` (`unoptimized: false`) untuk Vercel.

## 12.7 Dampak ke Kode (daftar kerja awal)
1. Ganti token di `app/globals.css` (`:root` = light, `.dark` = dark) + `tailwind.config.js`.
2. Pasang `ThemeProvider` + komponen toggle di Navbar & admin; hapus `class="dark"` hardcode di `app/layout.tsx` dan `background-color: #0b0f13` di CSS.
3. Hapus semua pemakaian `backdrop-blur`, blob `blur-[...]`, `shadow-[0_0_...primary]`, `bg-clip-text` gradient, `text-shadow` di seluruh komponen.
4. Redesain layout: Home (+ portfolio terpilih), Services, Portfolio, Case Study, About (+ Our Process), Contact, Footer, Admin.
5. i18n ID/EN + migrasi skema (field terjemahan) + admin form dwibahasa.
6. Perbaikan teknis di 12.1.
