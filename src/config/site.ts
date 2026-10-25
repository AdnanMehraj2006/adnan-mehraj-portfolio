/**
 * Central site configuration.
 * The resume (CV) download URL is configured in ONE place here.
 *
 * HOW TO SET UP THE CV DOWNLOAD:
 *   1. Paste a genuine HTTPS direct-download URL into `resumeDownloadUrl`.
 *   2. While `resumeDownloadUrl` is the empty string, the "Resume / CV"
 *      button renders normally but is a silent no-op — clicking it does
 *      nothing, navigates nowhere, and shows no feedback.
 *
 * IMPORTANT: Google Drive "share" URLs open a preview page rather than
 * downloading a file. The configured URL must be a true direct-download
 * URL (or a same-origin download endpoint). For Google Drive, use a link
 * ending in `?export=download` or a suitable direct-download URL. The
 * browser's `download` attribute cannot force a download across every
 * external origin, so the download helper (`src/lib/download.ts`) fetches
 * the file as a blob and saves it locally, falling back to opening the
 * direct URL when a cross-origin fetch is not permitted.
 */
export const siteConfig = {
  name: 'Adnan Mehraj',
  identity: 'AM.dev',
  role: 'Computer Engineering Student · Developer · Problem Solver',
  heroPrimary: 'Building things that solve real problems.',
  heroAlt: 'Curiosity in. Code out.',
  heroIntro: [
    "I'm Adnan Mehraj, a Computer Engineering student who enjoys turning ideas into practical software. I build projects across desktop applications, web development, and problem-solving, while strengthening my foundations in data structures, algorithms, and software engineering.",
    "I'm interested in understanding how things work, building useful tools, and continuously pushing beyond what I already know.",
  ],
  heroShort:
    'Computer Engineering student building practical software, exploring new technologies, and sharpening the problem-solving mindset behind great engineering.',
  heroMeta: {
    status: 'BUILDING',
    focus: 'SOFTWARE ENGINEERING',
    interests: 'DSA / WEB / CYBERSECURITY',
    location: 'INDIA',
  },

  /** @description Direct-download URL for the CV. Keep empty until configured. */
  resumeDownloadUrl: '',
} as const
