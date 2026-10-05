export type ImageKind =
  | 'logo'
  | 'portfolio-cover'
  | 'portfolio-gallery'
  | 'team-photo'
  | 'og-image'

export interface ImageSpec {
  kind: ImageKind
  title: string
  recommendedSize: string
  aspectRatio: string
  allowedFormats: string[]
  maxSizeMB: number
  note: string
}

export const imageSpecs: Record<ImageKind, ImageSpec> = {
  logo: {
    kind: 'logo',
    title: 'Logo Header / Footer',
    recommendedSize: '400 × 120 px (@2x: 800 × 240 px)',
    aspectRatio: '±3.3:1 (fleksibel)',
    allowedFormats: ['image/svg+xml', 'image/png', 'image/webp'],
    maxSizeMB: 1,
    note: 'Gunakan latar belakang transparan. Hindari garis teks yang terlalu tipis.',
  },
  'portfolio-cover': {
    kind: 'portfolio-cover',
    title: 'Cover Proyek Portofolio',
    recommendedSize: '1600 × 900 px',
    aspectRatio: '16:9',
    allowedFormats: ['image/jpeg', 'image/webp', 'image/png'],
    maxSizeMB: 2,
    note: 'Tampil pada kartu portofolio dan banner utama studi kasus. Posisikan fokus objek di area tengah.',
  },
  'portfolio-gallery': {
    kind: 'portfolio-gallery',
    title: 'Galeri Visual Proyek',
    recommendedSize: 'Lebar minimal 1600 px (saran 1600 × 1000 px)',
    aspectRatio: 'Fleksibel (16:10, 3:2, atau poster vertikal)',
    allowedFormats: ['image/jpeg', 'image/webp', 'image/png'],
    maxSizeMB: 2,
    note: 'Bisa mengunggah beberapa gambar visual detail sekaligus.',
  },
  'team-photo': {
    kind: 'team-photo',
    title: 'Foto Potret Tim',
    recommendedSize: '800 × 1000 px',
    aspectRatio: '4:5',
    allowedFormats: ['image/jpeg', 'image/webp', 'image/png'],
    maxSizeMB: 1,
    note: 'Posisikan wajah di sepertiga atas foto dengan latar polos atau netral.',
  },
  'og-image': {
    kind: 'og-image',
    title: 'Gambar Pratinjau Tautan (OpenGraph)',
    recommendedSize: '1200 × 630 px',
    aspectRatio: '1.91:1',
    allowedFormats: ['image/jpeg', 'image/png'],
    maxSizeMB: 1,
    note: 'Muncul otomatis saat tautan website dibagikan di WhatsApp, LinkedIn, atau Twitter.',
  },
}

