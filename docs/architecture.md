# Architecture, Database & i18n

## 1. Stack

| Layer | Pilihan | Catatan |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server Components + Server Actions |
| Bahasa | TypeScript | Seluruh kode baru `.ts/.tsx` |
| Styling | Tailwind CSS 3.4 + CSS variables | Token di `globals.css` |
| UI primitives | Radix UI / shadcn | Hanya yang dipakai; hapus sisanya |
| Animasi | Framer Motion saja | Halus, hormati reduced-motion |
| Tema | `next-themes` | `defaultTheme="light"`, `enableSystem={false}` |
| i18n | Routing `[locale]` + kamus JSON | Lihat architecture.md |
| Font | `next/font/google` | Heading serif (Fraunces/Instrument Serif) + Inter |
| Ikon | lucide-react | |
| DB | PostgreSQL + Prisma 6 | Mis. Neon/Vercel Postgres |
| Storage | Vercel Blob | `@vercel/blob` |
| Auth | `jose` (JWT) + `bcryptjs` | Lihat security.md |
| Validasi | zod (+ react-hook-form di admin) | Server-side wajib |
| Toast | sonner | |
| Hosting | Vercel | Hapus `output: 'standalone'` |
| Package manager | Yarn 1 | |

**Dihapus**: `mongodb`, `axios`, `lodash`, `dayjs` (pakai date-fns), `swr`, `@tanstack/*`, `recharts` (kecuali dipakai dashboard), `.emergent/`, folder `MD/`, konfigurasi preview emergent di `next.config.js`.

## 2. Struktur Folder Target

```
app/
  [locale]/                    id | en
    layout.tsx                 html lang, ThemeProvider, Navbar, Footer
    page.tsx                   Home
    services/page.tsx
    portfolio/page.tsx
    portfolio/[slug]/page.tsx
    about/page.tsx
    contact/page.tsx (+ actions.ts)
    not-found.tsx
  admin/                       tidak dilokalisasi (UI admin: Indonesia)
    (auth)/login/page.tsx
    (panel)/layout.tsx         sidebar + guard
    (panel)/page.tsx           dashboard
    (panel)/services|portfolio|categories|team|messages|settings/
  api/                         (opsional) revalidate/health
  sitemap.ts, robots.ts, opengraph-image (opsional)
components/
  layout/ (Navbar, Footer, ThemeToggle, LocaleSwitcher)
  sections/ (Hero, ServicesGrid, FeaturedWork, Process, Stats, Team, CtaBand)
  portfolio/ (ProjectCard, FilterBar, Gallery)
  admin/ (DataTable, ImageField, LocalizedField, ConfirmDialog, ...)
  ui/                          primitives yang dipakai
lib/
  prisma.ts, data.ts (query publik), auth.ts, i18n/ (config, dictionaries, getDictionary), blob.ts, validators/
prisma/ schema.prisma, seed.ts
docs/
```

## 3. Rendering & Data
- Halaman publik: Server Components, `revalidate` (ISR) + `revalidateTag/Path` dari server action admin → tidak perlu `force-dynamic` di semua halaman.
- Query publik terpusat di `lib/data.ts`; menerima `locale` dan mengembalikan teks terlokalisasi (fallback ke bahasa lain jika kosong).
- Error DB **tidak** diam-diam diganti data mock di produksi; tampilkan empty state yang benar. Mock hanya via seed.
- Komponen client hanya untuk interaksi (filter, toggle, form, animasi).

## 4. Alur Request
```
Request → middleware (locale redirect + guard /admin) → Server Component
        → lib/data (Prisma) → render (dictionary + data)
Admin form → Server Action → requireAdmin() → zod validate → Prisma/Blob → revalidate
```

## 5. Environment Variables
`DATABASE_URL`, `DIRECT_URL` (jika Neon), `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_SITE_URL`. (Kredensial admin awal ada di seed, bukan env.)

## 6. Deploy (Vercel)
- Build: `prisma generate && next build`; migrasi: `prisma migrate deploy`.
- Seed hanya di lingkungan dev/staging; produksi buat admin lewat script terpisah.
- Image `next/image` dengan optimasi aktif; izinkan `*.public.blob.vercel-storage.com`.

---

## Database Schema (PostgreSQL + Prisma)

Strategi dwibahasa: **kolom eksplisit per bahasa** (`xxxId` = Indonesia, `xxxEn` = Inggris) — sederhana, bisa divalidasi, mudah di-query. Bahasa utama: **ID**; EN opsional dengan fallback ke ID.

### Model

#### User
| Field | Tipe | Catatan |
|---|---|---|
| id | String (cuid) | PK |
| email | String @unique | |
| passwordHash | String | bcrypt, **bukan** plaintext |
| name | String | |
| role | Enum `ADMIN` | siap diperluas |
| createdAt | DateTime | |

#### Service
| Field | Tipe | Catatan |
|---|---|---|
| id | String | |
| slug | String @unique | anchor di halaman Services |
| titleId / titleEn? | String | |
| descriptionId / descriptionEn? | String | |
| featuresId / featuresEn | String[] | bullet fitur |
| icon | String? | key lucide, mis. `code`, `palette`, `camera`, `database`, `home` |
| order | Int @default(0) | urutan tampil |
| isActive | Boolean @default(true) | |
| portfolios | Portfolio[] | |
| createdAt / updatedAt | DateTime | |

#### PortfolioCategory
| Field | Tipe |
|---|---|
| id, slug @unique | String |
| nameId / nameEn? | String |
| order | Int |
| portfolios | Portfolio[] |

#### Portfolio
| Field | Tipe | Catatan |
|---|---|---|
| id | String | |
| slug | String @unique | auto dari judul |
| titleId / titleEn? | String | |
| summaryId / summaryEn? | String | ringkasan 1–2 kalimat |
| challengeId / challengeEn? | String? | |
| solutionId / solutionEn? | String? | |
| resultId / resultEn? | String? | |
| coverUrl | String | 16:9 |
| gallery | String[] | URL Blob |
| link | String? | proyek live |
| client | String? | |
| year | String? | |
| teamNote | String? | mis. "Design, Frontend" |
| featured | Boolean @default(false) | tampil di Home |
| order | Int @default(0) | |
| isPublished | Boolean @default(true) | draft/terbit |
| categoryId | String → PortfolioCategory | wajib |
| serviceId | String? → Service | |
| createdAt / updatedAt | DateTime | |

#### TeamMember
| Field | Tipe |
|---|---|
| id | String |
| name | String |
| roleId / roleEn? | String |
| bioId? / bioEn? | String |
| skills | String[] |
| photoUrl | String? (4:5) |
| order | Int |
| isActive | Boolean |

#### ContactMessage
| Field | Tipe | Catatan |
|---|---|---|
| id | String | |
| name, email | String | |
| phone? | String | |
| interest? | String | layanan diminati |
| message | String | |
| locale | String | `id`/`en` saat dikirim |
| isRead | Boolean @default(false) | |
| createdAt | DateTime | |

#### SiteSettings (singleton, id = `"singleton"`)
| Field | Tipe |
|---|---|
| headerLogoUrl / footerLogoUrl | String? |
| email | String |
| whatsapp | String (format internasional, mis. 62812…) |
| address | String? |
| latitude / longitude | Float? |
| instagram / linkedin / github / twitter / tiktok / youtube | String? |
| ogImageUrl | String? |
| statsJson | Json? (angka dampak: label ID/EN + nilai) |
| updatedAt | DateTime |

### Relasi
```
PortfolioCategory 1—N Portfolio N—1 Service(opsional)
User, TeamMember, ContactMessage, SiteSettings: berdiri sendiri
```

### Aturan Data
- `slug` di-generate otomatis, unik; saat bentrok tambah sufiks.
- Hapus Service yang dipakai portfolio → set `serviceId` null (`onDelete: SetNull`). Hapus kategori yang dipakai → ditolak (`Restrict`).
- Query publik: `isActive/isPublished = true`, urut `order` lalu `createdAt`.
- Teks EN kosong → fallback ke ID di lapisan `lib/data.ts`.
- Index: `Portfolio(categoryId, isPublished, order)`, `Portfolio(featured)`, `ContactMessage(isRead, createdAt)`.

### Migrasi dari skema lama
Data lama dummy → `prisma migrate reset` lalu `db seed`. Perubahan utama: `title/description` → `titleId/...En`, `Portfolio.category` (string) → relasi `PortfolioCategory`, `imageUrl` → `coverUrl`, `description` → `summary*`, `User.password` → `passwordHash`, tambah `TeamMember`, perluas `SiteSettings`.

---

## Internationalization (ID / EN)

### 1. Keputusan
- Locale: `id` (default) dan `en`.
- URL ber-prefix: `/id/...`, `/en/...`. `/` redirect ke locale dari cookie `NEXT_LOCALE` → header `Accept-Language` → `id`.
- Admin **tidak** dilokalisasi (UI Indonesia); hanya kontennya dwibahasa.
- Implementasi ringan tanpa library berat: kamus JSON + helper (`next-intl` boleh jika ingin, tapi tidak wajib).

### 2. Struktur
```
lib/i18n/
  config.ts            locales = ['id','en'], defaultLocale = 'id'
  dictionaries/id.json
  dictionaries/en.json
  get-dictionary.ts    server-only, async
```
- Route: `app/[locale]/...`, `generateStaticParams` untuk dua locale, validasi param (locale tak dikenal → `notFound()`).
- `<html lang={locale}>` di `app/[locale]/layout.tsx`.

### 3. Dua Jenis Teks
| Jenis | Sumber | Contoh |
|---|---|---|
| UI statis | Kamus JSON | Menu, tombol, judul section, label form, pesan error |
| Konten dinamis | Kolom DB `xxxId/xxxEn` | Judul layanan, deskripsi portfolio, peran tim |

Helper `pick(obj, 'title', locale)` → `obj.titleEn ?? obj.titleId` bila EN kosong (fallback ke ID).

### 4. Middleware
Satu `middleware.ts`:
1. `/admin/*` → guard auth (lihat security.md).
2. Path publik tanpa locale → redirect ke locale terdeteksi.
3. Abaikan `_next`, `api`, file statis, `sitemap.xml`, `robots.txt`.

### 5. LocaleSwitcher
Mempertahankan path & query (`/id/portfolio?kategori=web` ↔ `/en/portfolio?kategori=web`), set cookie `NEXT_LOCALE`. Slug portfolio sama di kedua bahasa (satu slug).

### 6. SEO
- `metadata` per halaman per locale (title, description, OG).
- `alternates.languages` → `hreflang` `id` & `en` + `x-default`.
- `sitemap.ts` memuat kedua locale untuk tiap URL.

### 7. Format
Tanggal & angka via `Intl` sesuai locale (`id-ID`/`en-US`). Tahun portfolio disimpan string.

### 8. Kerja Penerjemahan
- Semua string UI wajib lewat kamus; **tidak ada teks hardcode** di komponen.
- Kunci kamus bernamespace: `nav.*`, `home.hero.*`, `services.*`, `portfolio.*`, `about.*`, `contact.*`, `footer.*`, `common.*`, `errors.*`.
- Tes: skrip memeriksa kunci `id.json` dan `en.json` identik.
- Copy ID adalah acuan utama; EN diterjemahkan natural, bukan harfiah.
