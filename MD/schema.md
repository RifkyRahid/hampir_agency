# Database Schema (Prisma)

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      String   @default("ADMIN") // Role for data entry
  createdAt DateTime @default(now())
}

model Service {
  id          String      @id @default(uuid())
  title       String
  description String
  icon        String?     // SVG path, URL, or identifier
  isActive    Boolean     @default(true)
  portfolios  Portfolio[] // Relation to Portfolio
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Portfolio {
  id          String   @id @default(uuid())
  title       String
  description String
  imageUrl    String
  link        String?
  category    String   // e.g., 'Web', 'Design', 'Video'
  serviceId   String?
  service     Service? @relation(fields: [serviceId], references: [id])
  createdAt   DateTime @default(now())
}

model ContactMessage {
  id        String   @id @default(uuid())
  name      String
  email     String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}