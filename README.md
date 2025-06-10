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

## Customization

### Adding New Demos
1. Edit `public/data/demos.json`.
2. Add a new object with fields like:
```json
{
  "id": "phy-003",
  "title": "New Demo Title",
  "category": "Physics",
  "gradeLevel": "JSS2",
  "description": "Short description.",
  "explanation": "Detailed explanation.",
  "simulationUrl": "/sims/new-demo.html",
  "imageUrl": "https://...",
  "videoUrl": "https://...",
  "questions": [ ... ]
}
```
3. Save and reload the app.

### Theming
- Modify `tailwind.config.ts` and `styles/globals.css` for custom themes.
- Use the theme toggle in the UI for light/dark mode.

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

## Contributing
1. Fork the repo and create your branch.
2. Make your changes (add demos, improve UI, etc).
3. Open a Pull Request.

For demo contributions, please follow the structure in `public/data/demos.json`.

---

