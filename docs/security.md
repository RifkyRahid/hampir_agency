# Security, Operations & Seed

## 1. Masalah Sebelum Redesign
- Cookie sesi bernilai konstan `'authenticated'` (bisa dipalsukan).
- Kredensial default di kode (`admin123`); login tidak memakai tabel `User`.
- Server action admin tidak (terverifikasi) mengecek sesi sendiri — hanya middleware.
- Header `X-Frame-Options: ALLOWALL`, CSP `frame-ancestors *`, CORS `*` (sisa preview Emergent).
- Form kontak tanpa validasi email/anti-spam; upload menerima SVG tanpa sanitasi.

## 2. Autentikasi
- Login: email + password → cari `User` → `bcryptjs.compare(passwordHash)`.
- Sesi: **JWT bertanda tangan** (`jose`, HS256, `AUTH_SECRET`) berisi `sub`, `role`, `exp` (7 hari), disimpan di cookie `httpOnly`, `secure` (prod), `sameSite=lax`, `path=/`.
- `lib/auth.ts`: `createSession`, `getSession()`, `requireAdmin()` (throw/redirect jika tidak valid).
- **Defense in depth**: middleware memverifikasi JWT untuk `/admin/*` **dan** setiap server action/route admin memanggil `requireAdmin()` di baris pertama.
- Rate limit login (mis. 5 percobaan/15 menit per IP+email; Vercel KV/Upstash atau tabel `LoginAttempt` sederhana). Pesan error generik.
- Logout: hapus cookie. Ganti password: halaman di Pengaturan (opsional fase 2).
- Admin pertama dibuat lewat seed (dev) / script `scripts/create-admin.ts` (prod) dengan password dari input, bukan hardcode.

## 3. Validasi & Input
- Semua input server action divalidasi **zod** di server.
- Form kontak: panjang maksimal, format email, honeypot field, rate limit per IP, sanitasi tampilan (React sudah escape; jangan `dangerouslySetInnerHTML`).
- Upload: cek MIME **dan** ekstensi, batas ukuran per `kind` (admin.md), SVG hanya logo/ikon dan disanitasi.

## 4. Header Keamanan (`next.config.js`)
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains
Content-Security-Policy: (default-src 'self'; img-src 'self' data: https://*.public.blob.vercel-storage.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' (+ nonce bila memungkinkan); frame-ancestors 'none')
```
Hapus CORS `*`, `allowedDevOrigins`/`serverActions.allowedOrigins` bernuansa emergent; `serverActions.bodySizeLimit` cukup `4mb`–`5mb` (sesuai batas upload baru) — upload besar via client upload Vercel Blob jika diperlukan.

## 5. Rahasia & Repo
- `.env*` ada di `.gitignore`; sediakan `.env.example` (tanpa nilai).
- Hapus/ignore `memory/test_credentials.md`. Rotasi password/token jika pernah ter-commit.
- Token Blob & `AUTH_SECRET` hanya di Vercel Environment Variables.

## 6. Operasional
- Backup DB terjadwal (fitur provider). 
- Logging error server tanpa data sensitif.
- Dependabot/`yarn audit` berkala; hapus dependency tak terpakai.
- Health check sederhana (`/api/health`) opsional.
- Pantau kuota Vercel Blob; kompres gambar sebelum upload (panduan ukuran di admin).

## 7. Checklist Rilis
- [ ] `AUTH_SECRET` kuat (≥32 byte acak) di Vercel
- [ ] Admin dibuat, password kuat, seed dev **tidak** dijalankan di prod
- [ ] Header keamanan aktif & diuji
- [ ] Semua server action admin memanggil `requireAdmin()`
- [ ] Rate limit login & kontak aktif
- [ ] `.env.example` ada, secret tidak di repo
- [ ] Lighthouse ≥ 90, axe tanpa isu kritis

---

## Seed Data

Tujuan: setelah `prisma migrate reset`, situs langsung terlihat lengkap (ID/EN, light/dark) untuk review desain. File: `prisma/seed.ts`. Jalankan hanya di dev/staging.

```
yarn prisma migrate reset --force   # reset + seed otomatis
yarn prisma db seed                 # seed saja
```
`package.json`: `"prisma": { "seed": "tsx prisma/seed.ts" }` (tambah devDependency `tsx`).

Seed bersifat **idempotent** (upsert berdasarkan `slug`/`email`) dan **tidak** mengunggah ke Vercel Blob.

### Gambar Seed
Placeholder lokal di `public/seed/` (cover 1600×900, tim 800×1000, logo SVG sederhana) agar sesuai rasio yang disarankan. Diganti lewat admin; path `/seed/...` tetap valid untuk `next/image`.

### Admin
| Email | Password | Catatan |
|---|---|---|
| `admin@hampir.agency` | `ChangeMe!2026` (hash bcrypt) | Hanya dev. **Wajib diganti**. |

### SiteSettings
Email `hampiragency@gmail.com`, WhatsApp `6281234567890` (placeholder), alamat "Batam, Kepulauan Riau, Indonesia", koordinat 1.0456 / 104.0305, sosial placeholder (Instagram, LinkedIn, GitHub), statsJson: Tim inti 4 · Proyek 20+ · Layanan 4 · Respons 24 jam.

### Services (4, urutan 1–4)
| slug | ID | EN | icon |
|---|---|---|---|
| web-app | Pengembangan Web & Aplikasi | Web & App Development | code |
| graphic-design | Desain Grafis & Branding | Graphic Design & Branding | palette |
| photo-video | Foto & Video | Photo & Video | camera |
| data-ops | Data Entry & Operasional | Data Entry & Operations | database |

Masing-masing: deskripsi ID/EN (2 kalimat) dan 3 fitur (mis. web: Next.js & TypeScript · CMS & Dashboard Kustom · API & Desain Database).

### Kategori Portfolio
`web` (Web), `design` (Desain/Design), `video` (Video), `photo` (Foto/Photo).

### Portfolio (8; 4 featured)
| slug | Judul | Kategori | Layanan | Featured |
|---|---|---|---|---|
| mecca-madina-auto-syariah | Mecca Madina Auto Syariah | web | web-app | ✔ |
| ram-showroom-hrms | RAM Showroom HRMS | web | web-app | ✔ |
| fintech-rebrand | Rebranding Aplikasi Fintech | design | graphic-design | ✔ |
| urban-lifestyle-campaign | Kampanye Urban Lifestyle | video | photo-video | ✔ |
| restoran-nusantara-menu | Desain Menu & Identitas Restoran | design | graphic-design | |
| produk-kopi-photography | Fotografi Produk Kopi Lokal | photo | photo-video | |
| clinic-landing-page | Landing Page Klinik | web | web-app | |
| company-profile-video | Video Profil Perusahaan | video | photo-video | |

Tiap proyek: summary, challenge, solution, result (ID + EN), client, year, teamNote, cover, 2–4 gambar galeri (campur landscape & poster vertikal agar layout diuji). Satu proyek sengaja **tanpa** galeri dan satu **tanpa** teks EN (uji fallback). Satu draf (`isPublished=false`) untuk uji admin.

### Tim (4)
| Nama | Peran ID / EN | Skill |
|---|---|---|
| Rifky Rahid | Web Developer / UI·UX | Next.js, TypeScript, PostgreSQL |
| Anisa Putri | Desainer Grafis / Digital Marketing | Figma, Branding, Meta Ads |
| Bagas Pratama | Videografer / Fotografer | Premiere Pro, Lightroom, Sinematografi |
| Dewi Lestari | Data Entry / Operasional | Notion, Google Sheets, QA |

(Nama dari mock lama; ganti dengan data asli kapan saja.)

### ContactMessage (5)
Campuran terbaca/belum, locale id/en, dengan/ tanpa telepon & minat, rentang tanggal 2 minggu terakhir.
