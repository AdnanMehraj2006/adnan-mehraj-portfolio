export type ProjectPreviewKind =
  | 'clipboard'
  | 'legal'
  | 'player'
  | 'card'
  | 'os'
  | 'dsa'

export interface Project {
  id: string
  name: string
  category: string
  tagline: string
  description: string
  stack: string[]
  highlights: string[]
  repo: string
  demo?: string
  release?: { version: string; url: string }
  featured: boolean
  preview: ProjectPreviewKind
}

export const projects: Project[] = [
  {
    id: 'clipmind',
    name: 'ClipMind',
    category: 'Windows Desktop Application',
    tagline: 'Your clipboard, finally under control.',
    description:
      'ClipMind is a free, local-first Windows clipboard manager designed to make copied information easier to find and reuse. It combines searchable clipboard history with favorites, reusable snippets, collections, and system-tray integration.',
    stack: ['C#', 'WPF', '.NET', 'SQLite', 'Windows API'],
    highlights: [
      'Searchable clipboard history',
      'Favorites and reusable snippets',
      'Collections for organizing content',
      'Local-first data storage',
      'Windows system-tray integration',
      'Best-effort sensitive-content filtering',
    ],
    repo: 'https://github.com/AdnanMehraj2006/ClipMind',
    release: {
      version: 'v1.0.0',
      url: 'https://github.com/AdnanMehraj2006/ClipMind/releases/tag/v1.0.0',
    },
    featured: true,
    preview: 'clipboard',
  },
  {
    id: 'lawmitra',
    name: 'LawMitra AI',
    category: 'Legal Information Tool',
    tagline: 'Making legal information easier to navigate.',
    description:
      'LawMitra AI is a browser-based Indian legal-guidance assistant that helps people explore common legal situations, identify practical next steps, organize evidence, and prepare complaint outlines.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Curated case data', 'Browser storage'],
    highlights: [
      'Case-pattern matching',
      'Practical next-step guidance',
      'Evidence checklists',
      'Complaint-draft assistance',
      'Official verification and escalation links',
      'Privacy-conscious optional local history',
    ],
    repo: 'https://github.com/AdnanMehraj2006/LawMitra-Ai',
    demo: 'https://adnanmehraj2006.github.io/LawMitra-Ai/',
    featured: true,
    preview: 'legal',
  },
  {
    id: 'streamverse',
    name: 'StreamVerse',
    category: 'Web Application',
    tagline: 'One player. Multiple streaming formats.',
    description:
      'StreamVerse is a lightweight browser-based video player designed to support multiple video and streaming formats through a clean, responsive interface.',
    stack: ['HTML', 'CSS', 'JavaScript', 'HLS.js', 'DASH.js'],
    highlights: [
      'MP4, WebM, and OGG support',
      'HLS streaming',
      'MPEG-DASH support',
      'Google Drive video support',
      'Responsive layout',
      'Animated interface',
    ],
    repo: 'https://github.com/AdnanMehraj2006/StreamVerse',
    demo: 'https://adnanmehraj2006.github.io/StreamVerse/',
    featured: true,
    preview: 'player',
  },
  {
    id: 'cardshield',
    name: 'CardShield',
    category: 'Browser Utility',
    tagline: 'Validate the structure. Understand the result.',
    description:
      'CardShield is a client-side card validation tool that checks card-number structure using the Luhn algorithm, evaluates expiry dates, and identifies likely card-network formats.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    highlights: [
      'Luhn algorithm validation',
      'Expiry-date checks',
      'Card-type detection',
      'Live card preview',
      'Responsive interface',
      'Client-side processing',
    ],
    repo: 'https://github.com/AdnanMehraj2006/CardShield',
    demo: 'https://adnanmehraj2006.github.io/CardShield/',
    featured: false,
    preview: 'card',
  },
  {
    id: '1clickos',
    name: '1ClickOS',
    category: 'Web Utility',
    tagline: 'Windows releases, organized.',
    description:
      '1ClickOS is a responsive Windows release-download portal that organizes versions from older Windows releases through Windows 11 in a searchable interface.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    highlights: [
      'Search and filtering',
      'Organized Windows releases',
      'Responsive navigation',
      'Dark visual design',
      'Download sources clearly labeled when unverified',
    ],
    repo: 'https://github.com/AdnanMehraj2006/1ClickOS',
    demo: 'http://1clickos.blogspot.com/',
    featured: false,
    preview: 'os',
  },
  {
    id: 'dsa',
    name: 'DSA Practice',
    category: 'Problem Solving',
    tagline: 'Consistent practice. Better problem-solving.',
    description:
      'A collection of coding-practice solutions that documents continued work on data structures, algorithms, and programming challenges across coding platforms.',
    stack: ['Data Structures', 'Algorithms', 'Java'],
    highlights: [
      'Coding practice',
      'Algorithmic thinking',
      'Organized solution history',
      'Continued learning',
    ],
    repo: 'https://github.com/AdnanMehraj2006/DSA',
    featured: false,
    preview: 'dsa',
  },
]

export const githubProfileUrl = 'https://github.com/AdnanMehraj2006'
