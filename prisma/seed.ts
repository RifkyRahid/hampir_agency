import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Admin User
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@hampir.agency').toLowerCase().trim()
  const rawPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const passwordHash = await bcrypt.hash(rawPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: 'ADMIN',
      name: 'Administrator',
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Administrator',
      role: 'ADMIN',
    },
  })
  console.log(`✅ Admin user seeded: ${admin.email}`)

  // 2. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      email: 'hampiragency@gmail.com',
      whatsapp: '6281234567890',
      address: 'Batam, Kepulauan Riau, Indonesia',
      latitude: 1.0456,
      longitude: 104.0305,
      instagram: 'https://instagram.com/hampiragency',
      linkedin: 'https://linkedin.com/company/hampiragency',
      github: 'https://github.com/hampiragency',
      statsJson: [
        { value: '4', labelId: 'Disiplin Ahli', labelEn: 'Core Disciplines' },
        { value: '25+', labelId: 'Proyek Selesai', labelEn: 'Completed Projects' },
        { value: '100%', labelId: 'Komitmen Kualitas', labelEn: 'Quality Focus' },
        { value: 'Batam', labelId: 'Basis Agensi', labelEn: 'Based in Batam' },
      ],
    },
  })
  console.log('✅ Site settings seeded')

  // 3. Portfolio Categories
  const categoriesData = [
    { slug: 'web', nameId: 'Web & Aplikasi', nameEn: 'Web & Apps', order: 1 },
    { slug: 'design', nameId: 'Desain & Merek', nameEn: 'Design & Branding', order: 2 },
    { slug: 'video', nameId: 'Video Komersial', nameEn: 'Video Production', order: 3 },
    { slug: 'photo', nameId: 'Fotografi', nameEn: 'Photography', order: 4 },
  ]

  const categories: Record<string, string> = {}
  for (const c of categoriesData) {
    const record = await prisma.portfolioCategory.upsert({
      where: { slug: c.slug },
      update: { nameId: c.nameId, nameEn: c.nameEn, order: c.order },
      create: c,
    })
    categories[c.slug] = record.id
  }
  console.log('✅ Portfolio categories seeded')

  // 4. Services
  const servicesData = [
    {
      slug: 'web-app',
      titleId: 'Pengembangan Web & Aplikasi',
      titleEn: 'Web & App Engineering',
      descriptionId:
        'Membangun website dan aplikasi berkinerja tinggi, responsif, dan mudah dikelola dengan Next.js, TypeScript, dan arsitektur database modern.',
      descriptionEn:
        'Engineering high-performance, accessible, and scalable web apps powered by modern frameworks, clean code, and robust database design.',
      featuresId: [
        'Next.js 15 & Arsitektur TypeScript',
        'CMS & Dashboard Manajemen Kustom',
        'Integrasi API & Keamanan Database',
        'Optimasi Core Web Vitals & SEO Teknis',
      ],
      featuresEn: [
        'Next.js 15 & TypeScript Architecture',
        'Custom Admin CMS & Dashboards',
        'API Integration & Database Security',
        'Core Web Vitals & Technical SEO',
      ],
      icon: 'code',
      order: 1,
    },
    {
      slug: 'graphic-design',
      titleId: 'Desain Grafis & Identitas Merek',
      titleEn: 'Brand Identity & Design',
      descriptionId:
        'Merumuskan identitas visual yang khas, berkarakter, dan konsisten dari logo, pedoman merek, hingga materi pemasaran digital.',
      descriptionEn:
        'Crafting distinct, cohesive brand identities from logos and visual guidelines to high-converting marketing collateral.',
      featuresId: [
        'Pedoman Identitas Merek & Desain Logo',
        'Desain Antarmuka UI/UX (Figma)',
        'Materi Promosi & Digital Marketing Kit',
        'Kemasan Produk & Aset Percetakan',
      ],
      featuresEn: [
        'Brand Identity Guidelines & Logo Design',
        'UI/UX Product Design (Figma)',
        'Marketing Collateral & Ad Creatives',
        'Packaging & Print-Ready Deliverables',
      ],
      icon: 'palette',
      order: 2,
    },
    {
      slug: 'photo-video',
      titleId: 'Produksi Foto & Video',
      titleEn: 'Photo & Video Production',
      descriptionId:
        'Merekam visual sinematik dan fotografi komersial yang mengomunikasikan nilai cerita brand Anda dengan kualitas produksi terbaik.',
      descriptionEn:
        'Producing cinematic video campaigns and crisp commercial photography that tell your brand story with compelling visual depth.',
      featuresId: [
        'Video Profil Perusahaan & Iklan Komersial',
        'Fotografi Produk & Katalog E-Commerce',
        'Penyuntingan Video Sinematik & Color Grading',
        'Konten Visual Media Sosial Format Pendek',
      ],
      featuresEn: [
        'Corporate Profiles & Commercial Spots',
        'Studio Product & Editorial Photography',
        'Post-Production & Advanced Color Grading',
        'Short-Form Social Media Video Content',
      ],
      icon: 'camera',
      order: 3,
    },
    {
      slug: 'data-ops',
      titleId: 'Tata Kelola Data & Operasional',
      titleEn: 'Data Management & Operations',
      descriptionId:
        'Manajemen entri data yang terstruktur, otomatisasi alur kerja back-office, dan jaminan akurasi data untuk mendukung keputusan bisnis.',
      descriptionEn:
        'Structured data cataloging, back-office process optimization, and rigorous data hygiene to keep business operations dependable.',
      featuresId: [
        'Digitalisasi & Pengorganisasian Basis Data',
        'Otomatisasi Spreadsheet & Manajemen Dokumen',
        'Jaminan Kualitas Data & Rekonsiliasi Rutin',
        'Integrasi Alur Kerja Operasional Harian',
      ],
      featuresEn: [
        'Database Digitization & Cataloging',
        'Spreadsheet Automation & QA Testing',
        'Data Cleansing & Operational Verification',
        'Standard Operating Procedure Alignment',
      ],
      icon: 'database',
      order: 4,
    },
  ]

  const services: Record<string, string> = {}
  for (const s of servicesData) {
    const record = await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    })
    services[s.slug] = record.id
  }
  console.log('✅ Services seeded')

  // 5. Team Members
  const teamData = [
    {
      name: 'Rifky Rahid',
      roleId: 'Web Developer / UI·UX Specialist',
      roleEn: 'Web Developer / UI·UX Specialist',
      bioId: 'Fokus pada arsitektur fullstack modern, performa web berkecepatan tinggi, dan antarmuka yang bersih.',
      bioEn: 'Specializing in modern fullstack architecture, web performance, and clean interfaces.',
      skills: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
      photoUrl: '/seed/team/rifky.svg',
      order: 1,
    },
    {
      name: 'Anisa Putri',
      roleId: 'Graphic Designer / Digital Marketer',
      roleEn: 'Graphic Designer / Digital Marketer',
      bioId: 'Mengembangkan identitas visual yang bermakna dan kampanye pemasaran berbasis data.',
      bioEn: 'Crafting expressive brand identities and targeted digital marketing campaigns.',
      skills: ['Figma', 'Brand Identity', 'Meta Ads', 'Typography'],
      photoUrl: '/seed/team/anisa.svg',
      order: 2,
    },
    {
      name: 'Bagas Pratama',
      roleId: 'Videographer & Commercial Photographer',
      roleEn: 'Videographer & Commercial Photographer',
      bioId: 'Menghadirkan storytelling visual lewat komposisi sinematik dan penyuntingan dinamis.',
      bioEn: 'Delivering visual storytelling through cinematic framing and dynamic post-production.',
      skills: ['Premiere Pro', 'DaVinci Resolve', 'Commercial Lighting'],
      photoUrl: '/seed/team/bagas.svg',
      order: 3,
    },
    {
      name: 'Dewi Lestari',
      roleId: 'Data Entry & Operations Specialist',
      roleEn: 'Data Entry & Operations Specialist',
      bioId: 'Memastikan integritas alur kerja operasional, pengolahan data presisi, dan kepatuhan QA.',
      bioEn: 'Ensuring operational data integrity, workflow automation, and rigorous QA tracking.',
      skills: ['Spreadsheet Architecture', 'Process Automation', 'Data QA'],
      photoUrl: '/seed/team/dewi.svg',
      order: 4,
    },
  ]

  for (const m of teamData) {
    const existing = await prisma.teamMember.findFirst({ where: { name: m.name } })
    if (existing) {
      await prisma.teamMember.update({ where: { id: existing.id }, data: m })
    } else {
      await prisma.teamMember.create({ data: m })
    }
  }
  console.log('✅ Team members seeded')

  // 6. Portfolios
  const portfoliosData = [
    {
      slug: 'mecca-madina-auto-syariah',
      titleId: 'Mecca Madina Auto Syariah',
      titleEn: 'Mecca Madina Auto Syariah',
      summaryId: 'Platform katalog digital dealer mobil syariah dengan sistem filter kendaraan dan peta interaktif.',
      summaryEn: 'Digital catalog platform for an ethical auto dealership featuring smart search and map integrations.',
      challengeId:
        'Dealer membutuhkan platform terstruktur untuk menampilkan stok unit yang sering berubah, memfasilitasi simulasi pembiayaan syariah tanpa riba, serta memudahkan calon pembeli menjadwalkan kunjungan inspeksi.',
      challengeEn:
        'The dealership needed a streamlined system to showcase dynamic vehicle inventory, offer transparent Islamic financing calculators, and enable test drive appointment bookings.',
      solutionId:
        'Kami merancang antarmuka berbasis web responsif dengan integrasi CMS yang memudahkan staf mengunggah spesifikasi mobil dalam hitungan menit, dilengkapi filter spesifikasi cerdas dan tombol kontak instan.',
      solutionEn:
        'We built a lightning-fast responsive web portal backed by a straightforward CMS, allowing team members to update vehicle specs in seconds with direct WhatsApp lead routing.',
      resultId:
        'Peningkatan interaksi pengguna hingga 180%, waktu tunggu pembaruan stok terpangkas drastis, dan tingkat konversi calon pembeli meningkat secara konsisten sejak peluncuran.',
      resultEn:
        'User inquiries grew by 180%, vehicle listing updates became instantaneous, and verified customer visits increased consistently post-launch.',
      coverUrl: '/seed/covers/mecca.svg',
      gallery: ['/seed/gallery/gallery-1.svg', '/seed/gallery/gallery-2.svg'],
      link: 'https://example.com/mecca-madina',
      client: 'Mecca Madina Group',
      year: '2025',
      teamNote: 'Fullstack Web, UI/UX, SEO',
      featured: true,
      order: 1,
      categorySlug: 'web',
      serviceSlug: 'web-app',
    },
    {
      slug: 'ram-showroom-hrms',
      titleId: 'RAM Showroom Internal HRMS',
      titleEn: 'RAM Showroom Internal HRMS',
      summaryId: 'Sistem absensi, manajemen tim penjualan, dan pelaporan performa internal showroom.',
      summaryEn: 'Internal sales management and staff performance portal for automotive showroom operations.',
      challengeId:
        'Proses rekap absensi, komisi penjualan per staf, dan evaluasi inventaris masih menggunakan pencatatan terpisah yang rawan kekeliruan.',
      challengeEn:
        'Employee attendance, sales commission audits, and daily handover logs were siloed in disconnected spreadsheets prone to human error.',
      solutionId:
        'Membangun dashboard internal yang aman berbasis peran pengguna, pelacakan target penjualan secara langsung, dan pelaporan rekap otomatis.',
      solutionEn:
        'Architected a role-based internal web dashboard featuring real-time commission tracking, shift attendance verification, and auto-generated monthly summaries.',
      resultId:
        'Efisiensi waktu administrasi bulanan meningkat lebih dari 65% dan seluruh catatan komisi menjadi transparan dan akurat.',
      resultEn:
        'Reduced administrative workload by over 65% while providing complete transparency in sales performance payouts.',
      coverUrl: '/seed/covers/ram.svg',
      gallery: ['/seed/gallery/gallery-2.svg', '/seed/gallery/gallery-3.svg'],
      client: 'RAM Showroom',
      year: '2025',
      teamNote: 'Database Architecture, Frontend, QA',
      featured: true,
      order: 2,
      categorySlug: 'web',
      serviceSlug: 'web-app',
    },
    {
      slug: 'fintech-rebrand',
      titleId: 'Rebranding Visual Aplikasi Finansial',
      titleEn: 'Fintech Visual Identity & App Rebrand',
      summaryId: 'Penyegaran total identitas visual, sistem desain, dan antarmuka produk digital keuangan mikro.',
      summaryEn: 'Complete visual identity overhaul and interface design system for a micro-finance tech platform.',
      challengeId:
        'Brand lama terasa kaku dan sulit bersaing di kalangan pengguna muda perkotaan yang menuntut kejelasan dan kemudahan visual.',
      challengeEn:
        'The legacy identity was perceived as outdated and struggled to resonate with mobile-first urban professionals seeking clarity.',
      solutionId:
        'Menyusun identitas merek modern yang bersih, tipografi yang tegas, palet warna elegan, dan modul sistem komponen antarmuka yang terstandarisasi.',
      solutionEn:
        'Formulated a refreshed brand book, high-legibility typographic scale, and a scalable UI component library for iOS and Android surfaces.',
      resultId:
        'Meningkatkan persepsi kepercayaan publik dan mempermudah tim internal merilis fitur baru dengan tampilan yang tetap konsisten.',
      resultEn:
        'Strengthened consumer trust sentiment by 42% and accelerated the client engineering team product feature releases.',
      coverUrl: '/seed/covers/fintech.svg',
      gallery: ['/seed/gallery/gallery-1.svg', '/seed/gallery/gallery-3.svg'],
      client: 'Finova Solusi',
      year: '2024',
      teamNote: 'Brand Identity, Design Systems',
      featured: true,
      order: 3,
      categorySlug: 'design',
      serviceSlug: 'graphic-design',
    },
    {
      slug: 'urban-lifestyle-campaign',
      titleId: 'Kampanye Video Sinematik Urban Lifestyle',
      titleEn: 'Urban Lifestyle Commercial Video Campaign',
      summaryId: 'Produksi video komersial brand pakaian kasual dengan narasi visual kehidupan urban modern.',
      summaryEn: 'Commercial video production for a lifestyle apparel line showcasing the pace of modern urban living.',
      challengeId:
        'Klien membutuhkan materi iklan video berdurasi pendek namun berdaya pikat tinggi untuk peluncuran koleksi musiman di media sosial.',
      challengeEn:
        'The apparel brand required a compelling, cinematic short-form video series for an omni-channel seasonal release.',
      solutionId:
        'Pengambilan gambar lokasi dinamis dengan pencahayaan alami, komposisi sinematik, serta penyuntingan berirama cepat dengan color grading premium.',
      solutionEn:
        'Directed location-based shooting with cinematic natural lighting, rhythmic pacing, and bespoke cinematic color grading.',
      resultId:
        'Mencapai lebih dari 250.000 tayangan organik di media sosial dengan tingkat retensi tontonan 2,4 kali lebih tinggi dari rata-rata industri.',
      resultEn:
        'Generated over 250k organic impressions across platforms with viewer retention 2.4x above the client historical baseline.',
      coverUrl: '/seed/covers/urban.svg',
      videoUrl: 'https://www.youtube.com/watch?v=EngW7tLk6R8',
      gallery: ['/seed/gallery/gallery-3.svg'],
      client: 'Kave Apparel',
      year: '2024',
      teamNote: 'Cinematography, Directing, Color Grading',
      featured: true,
      order: 4,
      categorySlug: 'video',
      serviceSlug: 'photo-video',
    },
    {
      slug: 'restoran-nusantara-menu',
      titleId: 'Identitas Visual & Buku Menu Kuliner Nusantara',
      titleEn: 'Visual Identity & Menu Architecture for Nusantara Kitchen',
      summaryId: 'Perancangan identitas restoran premium, katalog menu fisik bertekstur, dan aset visual digital.',
      summaryEn: 'Refined brand identity, tactile menu book design, and digital assets for a premium Indonesian kitchen.',
      coverUrl: '/seed/covers/resto.svg',
      gallery: ['/seed/gallery/gallery-1.svg'],
      client: 'Nusantara Dining',
      year: '2024',
      featured: false,
      order: 5,
      categorySlug: 'design',
      serviceSlug: 'graphic-design',
    },
    {
      slug: 'produk-kopi-photography',
      titleId: 'Fotografi Studio Produk Kopi Spesialti',
      titleEn: 'Specialty Coffee Packaging & Studio Photography',
      summaryId: 'Sesi pemotretan studio komersial kemasan kopi biji dan sajian seduh dingin untuk e-commerce.',
      summaryEn: 'Studio product photography highlighting roast notes, tactile packaging, and cold-brew bottles.',
      coverUrl: '/seed/covers/kopi.svg',
      gallery: [],
      client: 'Origin Roast Batam',
      year: '2024',
      featured: false,
      order: 6,
      categorySlug: 'photo',
      serviceSlug: 'photo-video',
    },
    {
      slug: 'klinik-medika-landing-page',
      titleId: 'Portal Digital & Landing Page Klinik Medika',
      titleEn: 'Healthcare Portal & Appointment Web System',
      summaryId: 'Situs web informatif untuk layanan poli spesialis dengan formulir konsultasi terenkripsi.',
      summaryEn: 'Informational healthcare web presence featuring specialist schedules and booking intake.',
      coverUrl: '/seed/covers/klinik.svg',
      gallery: ['/seed/gallery/gallery-2.svg'],
      client: 'Klinik Medika Utama',
      year: '2024',
      featured: false,
      order: 7,
      categorySlug: 'web',
      serviceSlug: 'web-app',
    },
    {
      slug: 'company-profile-video',
      titleId: 'Video Profil Perusahaan Galangan Kapal',
      titleEn: 'Shipyard Heavy Industry Profile Video',
      summaryId: 'Liputan video fasilitas industri manufaktur berat dan standar keselamatan kerja maritim.',
      summaryEn: 'Heavy industrial documentation showcasing dry-dock facilities and maritime safety protocols.',
      coverUrl: '/seed/covers/compro.svg',
      gallery: ['/seed/gallery/gallery-3.svg'],
      client: 'Batam Marine Works',
      year: '2023',
      featured: false,
      order: 8,
      categorySlug: 'video',
      serviceSlug: 'photo-video',
    },
  ]

  for (const p of portfoliosData) {
    const categoryId = categories[p.categorySlug]
    const serviceId = p.serviceSlug ? services[p.serviceSlug] : null

    await prisma.portfolio.upsert({
      where: { slug: p.slug },
      update: {
        titleId: p.titleId,
        titleEn: p.titleEn,
        summaryId: p.summaryId,
        summaryEn: p.summaryEn,
        challengeId: p.challengeId,
        challengeEn: p.challengeEn,
        solutionId: p.solutionId,
        solutionEn: p.solutionEn,
        resultId: p.resultId,
        resultEn: p.resultEn,
        coverUrl: p.coverUrl,
        gallery: p.gallery,
        videoUrl: (p as any).videoUrl || null,
        client: p.client,
        year: p.year,
        teamNote: p.teamNote,
        featured: p.featured,
        order: p.order,
        categoryId,
        serviceId,
      },
      create: {
        slug: p.slug,
        titleId: p.titleId,
        titleEn: p.titleEn,
        summaryId: p.summaryId,
        summaryEn: p.summaryEn,
        challengeId: p.challengeId,
        challengeEn: p.challengeEn,
        solutionId: p.solutionId,
        solutionEn: p.solutionEn,
        resultId: p.resultId,
        resultEn: p.resultEn,
        coverUrl: p.coverUrl,
        gallery: p.gallery,
        videoUrl: (p as any).videoUrl || null,
        client: p.client,
        year: p.year,
        teamNote: p.teamNote,
        featured: p.featured,
        order: p.order,
        categoryId,
        serviceId,
      },
    })
  }
  console.log('✅ Portfolios seeded')

  // 7. Contact Messages
  const messagesData = [
    {
      name: 'Hendro Wijaya',
      email: 'hendro@wijayagroup.co.id',
      phone: '081234567891',
      interest: 'Pengembangan Web & Aplikasi',
      message: 'Halo tim Hampir.Agency, kami bermaksud merombak portal web perusahaan kami agar lebih modern dan memiliki portal klien.',
      locale: 'id',
      isRead: false,
    },
    {
      name: 'Sarah Jenkins',
      email: 's.jenkins@brightfuture.sg',
      phone: '+6591234567',
      interest: 'Brand Identity & Design',
      message: 'Hi there, we are looking for a creative agency in Batam to produce our new brand guidelines and marketing collateral.',
      locale: 'en',
      isRead: false,
    },
    {
      name: 'Budi Santoso',
      email: 'budi.santoso@gmail.com',
      message: 'Apakah ada paket produksi video komersial untuk produk UMKM kuliner di Batam? Terima kasih.',
      locale: 'id',
      isRead: true,
    },
  ]

  for (const msg of messagesData) {
    const existing = await prisma.contactMessage.findFirst({
      where: { email: msg.email, message: msg.message },
    })
    if (!existing) {
      await prisma.contactMessage.create({ data: msg })
    }
  }
  console.log('✅ Contact messages seeded')

  console.log('🎉 Seeding successfully completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

