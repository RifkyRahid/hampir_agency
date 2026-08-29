# System Architecture & Tech Stack

## Front-End & Back-End (Fullstack Framework)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS

## Database & ORM
- **Database:** PostgreSQL
- **ORM:** Prisma ORM

## Note on Architecture
Instead of separating a Node.js/Express backend, utilize Next.js API Routes (Route Handlers) and Server Actions for all backend logic to keep the monorepo clean, lightweight, and optimized. Prisma will handle all database communications.