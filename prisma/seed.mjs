import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.portfolio.deleteMany()
  await prisma.service.deleteMany()
  await prisma.contactMessage.deleteMany()

  const web = await prisma.service.create({
    data: { title: 'Web & App Development', description: 'High-performance, pixel-perfect websites and applications built with modern frameworks and clean, scalable code.', icon: 'code', isActive: true },
  })
  const design = await prisma.service.create({
    data: { title: 'Graphic Design', description: 'Bold brand identities, striking visuals, and marketing collateral that leave a lasting impression.', icon: 'palette', isActive: true },
  })
  const video = await prisma.service.create({
    data: { title: 'Photo & Video', description: 'Cinematic videography and crisp photography with premium production quality.', icon: 'camera', isActive: true },
  })
  await prisma.service.create({
    data: { title: 'Data Entry & Ops', description: 'Accurate, organized data management and back-office operations that keep everything running smoothly.', icon: 'database', isActive: true },
  })

  await prisma.portfolio.createMany({
    data: [
      {
        title: 'Mecca Madina Auto Syariah',
        slug: 'mecca-madina-auto-syariah',
        description: 'A used-car marketplace with a custom CMS and interactive map integrations.',
        imageUrl: '',
        gallery: [],
        link: 'https://example.com',
        category: 'Web',
        year: '2025',
        client: 'Mecca Madina Auto',
        team: 'UI/UX, Frontend, Backend',
        challenge: 'The dealership needed a scalable catalog that non-technical staff could update daily, plus map-based branch discovery for buyers.',
        solution: 'We built a Next.js storefront backed by a custom CMS, added map integrations for branch locations, and deployed behind Nginx for performance.',
        result: 'Listing updates dropped from hours to minutes and organic inquiries increased significantly after launch.',
        serviceId: web.id,
      },
      {
        title: 'RAM Showroom HRMS',
        slug: 'ram-showroom-hrms',
        description: 'An internal employee management system and analytics dashboard.',
        imageUrl: '',
        gallery: [],
        category: 'Web',
        year: '2025',
        client: 'RAM Showroom',
        team: 'Product, Frontend, Backend',
        challenge: 'HR processes were spread across spreadsheets with no single source of truth for attendance and payroll.',
        solution: 'We designed a role-based HRMS with a clean dashboard, automated attendance, and exportable reports.',
        result: 'Manual HR admin time was cut dramatically, with a single dashboard now driving decisions.',
        serviceId: web.id,
      },
      {
        title: 'Fintech App Rebranding',
        slug: 'fintech-app-rebranding',
        description: 'A complete visual identity and product UI overhaul.',
        imageUrl: '',
        gallery: [],
        category: 'Design',
        year: '2024',
        client: 'Confidential Fintech',
        team: 'Branding, UI/UX',
        challenge: 'The product looked dated and inconsistent, hurting trust in a competitive fintech market.',
        solution: 'We rebuilt the brand system, defined a modern design language, and reworked core product screens.',
        result: 'A cohesive, premium identity that lifted app-store ratings and user confidence.',
        serviceId: design.id,
      },
      {
        title: 'Urban Lifestyle Campaign',
        slug: 'urban-lifestyle-campaign',
        description: 'A commercial video shoot and post-production campaign.',
        imageUrl: '',
        gallery: [],
        category: 'Video',
        year: '2024',
        client: 'Urban Co.',
        team: 'Direction, Videography, Editing',
        challenge: 'The brand needed bold social-first video to stand out during a product launch.',
        solution: 'We handled direction, shooting, and editing to deliver a punchy, platform-optimized campaign.',
        result: 'Strong engagement across social channels during the launch window.',
        serviceId: video.id,
      },
    ],
  })

  await prisma.contactMessage.createMany({
    data: [
      { name: 'Andi Wijaya', email: 'andi@example.com', message: 'Hi, I would like a quote for a company profile website.', isRead: false },
      { name: 'Sarah Lim', email: 'sarah@example.com', message: 'Interested in a branding + video package for our launch.', isRead: true },
    ],
  })

  console.log('Seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
