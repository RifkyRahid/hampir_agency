# Detailed Design Specifications & Visual Guidelines

## 1. General Aesthetic & Vibe
- **Core Theme:** Premium, high-tech, "futuristic," and extremely clean (pixel-perfect).
- **Style:** "Glassmorphism" combined with clean lines and glowing accents.
- **Default State:** Primarily **Dark Mode**. Background must not be pure black, but a very dark, premium gray.

## 2. Color Palette (Dark Mode Primary)
- **Background:** Dark Charcoal/Navy (#0B0F13 or #0F172A).
- **Card/Section Background:** Slightly lighter gray (#171C24 or #1E293B) with a semi-transparent glass effect.
- **Accent/Highlight:** Vibrant Neon Green/Cyan (#00E676 or #22D3EE).
- **Typography (Base):** Crisp White (#FFFFFF).
- **Typography (Secondary/Muted):** Light Gray (#94A3B8).
- **Borders/Lines:** Very subtle, thin gray (#334155).

## 3. Typography
- **Font Family:** A modern, highly legible sans-serif (e.g., `Inter` or `Geist Sans` via `next/font`).

## 4. Key Layout Structures & Pages

### A. Home Page (The Bento Grid)
- Use a dynamic, asynchronous **Bento Grid** layout for Services and Portfolio highlights.
- **Cards:** Thin borders, `rounded-3xl`, glassmorphism background with `backdrop-blur`. 
- **Behavior:** Symmetrical but irregular mosaic on desktop, stacking vertically on mobile. Adding a new service via Admin organically fits the grid.

### B. About Us Page
- **The "Hero" Statement:** Massive, bold typography section with a subtle radial gradient glow behind it.
- **Impact Bar:** Horizontal strip displaying key statistics (e.g., 4 Experts, Full-Service).
- **Meet The Team:** A clean 2x2 grid representing the 4 core roles. Cards use glassmorphism. High-res grayscale portraits that turn to full color on hover.
- **Our Process:** Vertical glowing timeline showing discovery to delivery.

### C. Services Page
- **Layout:** "Sticky Scroll" or Alternating Rows. Left side acts as a sticky glowing index; right side displays deep dives into Web/App, Design, Photo/Video, etc. Must be scalable to append new rows dynamically.

### D. Portfolio / Case Studies Page
- **Layout:** Masonry Grid or Large Staggered Cards.
- **Filter Bar:** Sticky top bar with pill-shaped buttons to filter categories.
- **Interaction:** Glassmorphism overlay slides up on hover to reveal Project Title and Category. Clicking opens a clean article view (Challenge, Solution, Result).

### E. Contact Page
- **Layout:** Split Screen (50/50 on desktop).
- **Left Side:** Typography displaying email, direct WhatsApp button, and subtle glowing geographic coordinates (e.g., 1.0456° N, 104.0305° E) for a tech aesthetic.
- **Right Side:** A clean, glassmorphism form. Inputs glow Neon Green on focus.