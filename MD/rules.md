# AI Agent Rules, Constraints & Performance

## Tech Stack Enforcement
1. **No Express.js:** DO NOT use standard Node/Express.js backend. You MUST use Next.js App Router with TypeScript, Tailwind CSS, and Prisma ORM (PostgreSQL).
2. **Component Styling:** Build UI components natively using Tailwind CSS. 

## Performance & Stability (CRITICAL)
3. **Strict Animation Rule:** Use ONLY `Framer Motion` for animations. DO NOT import `anime.js`, `GSAP`, or any other animation library to prevent bundle bloat and React DOM conflicts. Keep animations smooth and lightweight.
4. **Image Optimization:** NEVER use standard HTML `<img>` tags. You MUST use Next.js `<Image>` component (`next/image`) for automatic WebP conversion and lazy loading.
5. **Font Optimization:** Use `next/font/google` to prevent layout shifts.
6. **Code Splitting:** Dynamically import heavy components using `next/dynamic` if they are not needed on the initial load.
7. **Lighthouse Score:** Code must be highly optimized aiming for a 90+ Lighthouse score. Use semantic HTML5 tags properly.

## Deployment Restraint (CRITICAL)
8. **DO NOT DEPLOY:** DO NOT configure, write scripts for, or attempt to deploy this application to emergent.sh hosting or any cloud provider.
9. **Environment:** Assume the project will be exported and run locally. Rely strictly on `.env` for database connections. The final codebase will be hosted manually on a personal VPS behind Nginx. Only ensure `npm run build` and `npm run start` work flawlessly.
