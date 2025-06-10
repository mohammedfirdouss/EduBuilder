# EduBuilder

EduBuilder is a modern web app designed to empower Nigerian Secondary School STEM teachers by providing simple, instant, and offline access to interactive STEM demonstrations.

---

## Features
- **Instant, offline access** to STEM demonstrations (PWA support)
- **Interactive simulations** for Physics, Chemistry, Biology, and Mathematics
- **Customizable content** and easy demo addition
- **Modern UI** using Radix UI and TailwindCSS
- **Responsive and mobile-friendly**
- **Works seamlessly offline** (service worker, offline page)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or use npm/yarn)

### Installation
```bash
pnpm install
```

### Running Locally
```bash
pnpm dev
```

### Building for Production
```bash
pnpm build
pnpm start
```

---

## Project Structure
- `app/` – Main app logic and pages
- `components/` – Reusable UI components and providers
- `hooks/` – Custom React hooks
- `lib/` – Utility functions
- `public/` – Static assets, manifest, service worker, demo data
- `styles/` – Global styles (TailwindCSS)

---

## PWA & Offline Support
- Installable on mobile/desktop (see browser install prompt)
- Works offline via service worker (`public/sw.js`)
- Offline fallback page (`public/offline.html`)
- Manifest (`public/manifest.json`) for app metadata and icons

---
## Tech Stack
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [TypeScript](https://www.typescriptlang.org/)

---
