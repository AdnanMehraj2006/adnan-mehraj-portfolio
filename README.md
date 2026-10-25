# Adnan Mehraj — Developer Portfolio

A dark, futuristic developer portfolio built with React, TypeScript, and Vite. It presents Adnan Mehraj (Computer Engineering student, developer, and problem solver), his projects, skills, problem-solving profiles, certifications, and contact links.

- **Live website:** https://adnanmehraj2006.github.io/adnan-mehraj-portfolio/
- **Repository:** https://github.com/AdnanMehraj2006/adnan-mehraj-portfolio

## Overview

The portfolio is a single-page application organized into clearly separated sections:

- **Hero** — name, headline, description, call-to-action buttons, and an interactive 3D coding-scene background (two floating code/terminal panels with orbital motion and mouse parallax). Respects `prefers-reduced-motion`.
- **About** — three “Build / Solve / Explore” focus cards.
- **Skills** — six skill groups; selecting a skill highlights the related project cards and brings them into view.
- **Projects** — six real projects (ClipMind, LawMitra AI, StreamVerse, CardShield, 1ClickOS, DSA Practice) with source links, live demos where available, and a ClipMind v1.0.0 release link.
- **Problem Solving** — LeetCode and GeeksforGeeks profiles plus the DSA practice repository.
- **Achievements** — verified certifications and participation cards (including Synertech 2026 “2nd Runner-Up”), some with “Verify Certificate” links.
- **Contact** — eight profile cards in order: Email, GitHub, LeetCode, GeeksForGeeks, LinkedIn, X, Instagram, Snapchat.
- **Footer** and utility UI (scroll progress, custom cursor, keyboard easter egg).

## Verified features

- Fixed navbar with active-section highlighting, smooth navigation, URL-hash sync, and correct Back/Forward restoration.
- Dark theme with neon-lime and cyan accents, grid backgrounds, and a developer-focused typography system.
- Responsive layout from 320px phones to large desktop (1920px), with no horizontal overflow.
- Accessibility landmarks, visible focus styles, safe external links (`rel="noopener noreferrer"`), and reduced-motion support.
- Skills → Projects highlighting and auto-scroll that keeps the first highlighted card visible.
- Resume/CV button is a silent no-op until a `resumeDownloadUrl` is configured (no invented file).

## Technology stack

- **React 19** + **TypeScript**
- **Vite 8** (build tool), **React Compiler**-compatible plugin
- **React Three Fiber** + **three** + **@react-three/drei** — 3D hero scene
- **Framer Motion** — UI animations
- **lucide-react** — icons
- **Oxlint** — linting
- **Playwright core** — smoke tests (dev-only)

## Project structure

```
src/
  components/        # UI components, one per section + shared primitives
    ui/              # Buttons, headings, reveal, brand icons, etc.
    HeroScene.tsx    # 3D coding scene
    ContactScene.tsx # (removed — Contact 3D visual no longer used)
  config/site.ts     # central site config incl. resumeDownloadUrl
  data/              # projects, skills, certifications, profiles
  hooks/             # useActiveSection, usePrefersReducedMotion
  lib/               # download helper (resume)
  App.tsx / main.tsx
```

## Local setup

Requirements: Node.js 20+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
# Vite prints the local URL (base: /adnan-mehraj-portfolio/)

# 3. Production build
npm run build

# 4. Lint
npm run lint

# 5. Preview the production build
npm run preview
```

## Smoke tests

The repo includes a headless-browser smoke suite (`smoke.mjs`).

```bash
# against a running dev/preview server (uses SMOKE_URL or defaults to :5173)
node smoke.mjs
```

Example with an explicit server URL:

```bash
SMOKE_URL=http://localhost:4173/adnan-mehraj-portfolio/ node smoke.mjs
```

## Deployment (GitHub Pages)

The Vite `base` is set to `/adnan-mehraj-portfolio/`, so the built `dist/` folder is ready for GitHub Pages under the `adnan-mehraj-portfolio` repository.

Option A — GitHub Pages via workflow:

1. Push the repo and enable GitHub Pages (Source: GitHub Actions).
2. Build with `npm ci && npm run build`.
3. Upload the `dist/` folder as the deployed artifact.

Option B — manual upload:

1. Run `npm run build`.
2. Upload the contents of `dist/` to the `gh-pages` branch (or the Pages source directory).

## Resume / CV configuration

The Resume/CV button is intentionally a silent no-op until a direct-download URL is set.

- Open `src/config/site.ts`.
- Set `resumeDownloadUrl` to a genuine HTTPS direct-download URL (e.g. a same-origin endpoint or a provider that supports direct downloads).
- The download helper (`src/lib/download.ts`) fetches the file as a blob and saves it; it falls back to opening the direct URL when a cross-origin fetch is not permitted.

## Accessibility and responsive notes

- Semantic landmarks and descriptive labels are used throughout.
- Keyboard focus is visible; decorative SVGs are `aria-hidden`.
- Reduced-motion users receive a static CSS fallback for the 3D hero and the animated/3D elements are kept subtle.
- The layout is tested across phones (320–430px), tablets (600–1024px), laptops, and desktops (up to 1920px) with no horizontal overflow.

## Known limitations

- The LeetCode/GeeksforGeeks sections deliberately show no fabricated solved-count statistics; they link to the real profiles.
- Some certificates lack public verification URLs, so only cards with real URLs show a “Verify Certificate” button.
- The Resume/CV button does nothing until `resumeDownloadUrl` is configured.
- GitHub/LinkedIn icons are bundled inline brand SVGs; the brand icons are theme-colored by design (recognizable by shape rather than original brand colors).

## Author

**Adnan Mehraj** — Computer Engineering Student & Developer

- GitHub: https://github.com/AdnanMehraj2006
- LinkedIn: https://www.linkedin.com/in/adnan-mehraj-611904344/
- LeetCode: https://leetcode.com/u/Adnan_Mehraj_2006/
- GeeksforGeeks: https://www.geeksforgeeks.org/profile/adnanmehraj2006
- X: https://x.com/AdnanMehraj2006
- Instagram: https://www.instagram.com/adn4nmehraj
- Snapchat: https://snapchat.com/add/adn4n.mehraj
