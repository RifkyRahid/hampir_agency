# Roadmap & Checklist

Dikerjakan bertahap; tiap fase bisa dicek dan di-review sebelum lanjut.

## Fase 0 — Persiapan & Bersih-bersih
- [ ] Hapus dependency/file tak terpakai (mongodb, axios, lodash, dayjs, swr, tanstack, `.emergent`, `MD/`)
- [ ] Ganti nama paket, bersihkan `next.config.js` (header, origins, standalone)
- [ ] Tambah `.env.example`, perbarui `.gitignore`
- [ ] Pasang dependency baru: `next-themes`, `jose`, `bcryptjs`, `tsx`, font (via next/font)

## Fase 1 — Fondasi Tema & i18n
- [ ] Token warna light/dark di `globals.css` + `tailwind.config.js` (design.md)
- [ ] ThemeProvider (`light` default), ThemeToggle, tanpa flash
- [ ] Font heading serif + Inter
- [ ] Routing `[locale]`, kamus id/en, LocaleSwitcher, middleware gabungan
- [ ] Primitif UI: Button, Card, Badge, Input, SectionHeader, Container

## Fase 2 — Database & Seed
- [ ] Skema baru (architecture.md), `migrate reset`
- [ ] `lib/data.ts` terlokalisasi + fallback bahasa
- [ ] `prisma/seed.ts` + gambar placeholder `public/seed/`

## Fase 3 — Halaman Publik
- [ ] Navbar & Footer
- [ ] Home (Hero, Services bento, Karya pilihan, Proses, CTA)
- [ ] Services (baris selang-seling + indeks sticky)
- [ ] Portfolio (filter dinamis) & Case Study
- [ ] About (misi, angka, tim DB, proses)
- [ ] Contact (form tervalidasi, honeypot, rate limit)
- [ ] 404, loading skeleton, empty state
- [ ] SEO: metadata per halaman, hreflang, sitemap, robots, OG

## Fase 4 — Admin
- [ ] Auth aman (jose + bcrypt), `requireAdmin()`, rate limit login
- [ ] Layout admin baru + dashboard data nyata
- [ ] `lib/image-specs.ts` + `ImageField` (catatan ukuran, preview rasio, validasi)
- [ ] CRUD: Services, Kategori, Portfolio (tab ID|EN), Tim
- [ ] Pesan, Pengaturan (logo, kontak, sosial, OG, stats)
- [ ] ConfirmDialog, toast, revalidasi path/tag

## Fase 5 — QA & Rilis
- [ ] Uji visual: light/dark × ID/EN × mobile/tablet/desktop
- [ ] Aksesibilitas (axe, keyboard, kontras), reduced motion
- [ ] Lighthouse ≥ 90 (perf, a11y, SEO, best practices)
- [ ] Verifikasi checklist keamanan (security.md §7)
- [ ] Deploy Vercel: env, `migrate deploy`, buat admin prod, ganti data placeholder

## Risiko
| Risiko | Mitigasi |
|---|---|
| i18n menambah beban konten | Fallback EN→ID; indikator terjemahan kurang di admin |
| Upload besar di Server Action (batas body Vercel ±4,5 MB) | Batas file ≤2 MB; bila perlu client upload langsung ke Blob |
| Konsistensi tema | Hanya pakai token, bukan warna hardcode; lint pencarian `#` warna |
| Kuota Blob | Panduan ukuran + kompresi + hapus gambar lama |

## Definition of Done (per halaman)
Sesuai design.md, dua tema, dua bahasa, responsif, tanpa warna/efek terlarang, a11y dasar lulus, metadata ada.
