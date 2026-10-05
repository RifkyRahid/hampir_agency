# Admin Guide (CMS)

Panel untuk Data Entry. UI admin berbahasa Indonesia; konten dwibahasa dengan tab **ID | EN**. Gaya mengikuti design.md (light default + toggle dark).

## 1. Navigasi
Dashboard · Services · Portfolio · Kategori · Tim · Pesan · Pengaturan · Keluar. Sidebar tetap (desktop), drawer (mobile), topbar dengan ThemeToggle dan nama user.

## 2. Modul

### Dashboard
Kartu: total Service aktif, Portfolio terbit/draf, Pesan belum dibaca, Anggota tim. Daftar "Aktivitas terbaru" (pesan masuk & portfolio terbaru dari DB). Tombol cepat: "Portfolio baru", "Lihat pesan".

### Services
Tabel (judul, status, urutan, aksi) + cari. Form: slug (otomatis), judul & deskripsi (ID/EN), fitur (daftar bullet, tambah/hapus/urutkan), ikon (pilih dari daftar lucide), urutan, aktif.

### Portfolio
Tabel (cover thumbnail, judul, kategori, status Terbit/Draf, Featured, aksi) + filter kategori/status + cari.
Form dipecah **tab/seksi**:
1. **Informasi** — judul, slug, kategori (wajib), layanan terkait, klien, tahun, tim, link, featured, terbit.
2. **Konten (ID | EN)** — ringkasan, tantangan, solusi, hasil. Indikator ⚠ jika EN belum terisi.
3. **Media** — cover (wajib), galeri (multi-upload, drag untuk urut, hapus per foto).

### Kategori Portfolio
CRUD sederhana (nama ID/EN, slug, urutan). Tidak bisa dihapus jika masih dipakai.

### Tim
CRUD anggota: nama, peran (ID/EN), bio (opsional), skill (chip), foto (4:5), urutan, aktif.

### Pesan
Daftar kartu: nama, email (mailto), telepon, minat, isi, waktu, bahasa. Aksi: tandai dibaca/belum, hapus (dialog konfirmasi). Filter: Semua / Belum dibaca. Badge jumlah belum dibaca di sidebar.

### Pengaturan
Logo header & footer, email, WhatsApp, alamat + koordinat, sosial media, OG image, angka dampak (About).

## 3. Panduan Ukuran Foto (WAJIB tampil di tiap input gambar)

Komponen `ImageField` menampilkan di bawah label: **ikon info + "Ukuran disarankan … · Rasio … · Format … · Maks …"**, area drop/upload, preview dengan rasio sesuai, progres upload, tombol ganti/hapus. Validasi sisi klien (cepat) dan **server** (aman).

| Input | Rasio | Ukuran disarankan | Format | Maks file | Catatan tampil di UI |
|---|---|---|---|---|---|
| Logo header / footer | ±3,3:1 (bebas) | 400×120 px (@2x 800×240) | SVG, PNG transparan | 1 MB | "Latar transparan; teks tidak terlalu tipis" |
| Cover portfolio | 16:9 | 1600×900 px | JPG, WebP | 2 MB | "Dipakai di kartu & hero studi kasus. Jaga subjek di tengah" |
| Galeri portfolio | bebas (saran 3:2) | lebar min. 1600 px | JPG, WebP | 2 MB/foto | "Boleh banyak; poster vertikal diperbolehkan" |
| Foto tim | 4:5 | 800×1000 px | JPG, WebP | 1 MB | "Wajah di sepertiga atas, latar polos" |
| OG image | 1,91:1 | 1200×630 px | JPG, PNG | 1 MB | "Muncul saat link dibagikan" |
| Ikon service (jika upload) | 1:1 | 256×256 px | SVG, PNG | 200 KB | |

Aturan teknis upload:
- Server action `uploadImage(file, kind)`; `kind` menentukan jenis yang diizinkan dan batas ukuran (satu sumber konfigurasi di `lib/image-specs.ts`, dipakai UI **dan** validasi server agar selalu sinkron).
- Nama file acak (uuid), simpan ke Vercel Blob `access: 'public'`, folder per jenis (`portfolio/`, `team/`, `logo/`, `og/`).
- Peringatan (bukan blokir) jika rasio menyimpang >10% dari rasio disarankan.
- Hapus gambar lama dari Blob saat diganti/dihapus (`del`).
- Tolak SVG berbahaya (sanitasi atau izinkan SVG hanya untuk logo/ikon).

## 4. Pola UX Admin
- Form: validasi zod, pesan error per field, tombol Simpan disabled saat proses, toast sukses/gagal (sonner).
- Hapus: `ConfirmDialog` (bukan `window.confirm`), menyebut nama item.
- Simpan memanggil `revalidatePath` untuk halaman publik terkait (kedua locale).
- Tab bahasa mempertahankan input antar tab; peringatan "perubahan belum disimpan" saat meninggalkan form.
- Tabel: paginasi/scroll, cari, urutan; state kosong & loading skeleton.
- Semua aksi server memanggil `requireAdmin()` (lihat security.md).
