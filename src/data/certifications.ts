export interface Certification {
  id: string
  title: string
  issuer: string
  date?: string
  /** Link to the issuing platform/credential, when verified. */
  verifyUrl?: string
  /** When true, details are confirmed by the issuer/public profile. */
  confirmed: boolean
}

/**
 * Certification data. Each entry is edited from this single file.
 * Only items with `confirmed: true` and a real issuer are shown to
 * visitors; anything pending verification is filtered out, so visitors
 * never see placeholder "awaiting details" text.
 */
export const certifications: Certification[] = [
  {
    id: 'cybersecurity-tmf',
    title: 'Cybersecurity',
    issuer: 'Tech Mahindra Foundation',
    date: 'November 2024',
    confirmed: true,
  },
  {
    id: 'ide-bootcamp',
    title: 'IDE Bootcamp',
    issuer: 'AICTE',
    date: 'November 2024',
    confirmed: true,
  },
  {
    id: 'java-greatlearning',
    title: 'Java Programming in Hindi',
    issuer: 'Great Learning',
    date: 'May 2022',
    confirmed: true,
  },
  {
    id: 'aic-summit',
    title: 'All India Career Summit — Certificate of Participation',
    issuer: 'Aptus Technologies',
    date: 'March 2026',
    confirmed: true,
  },
  {
    id: 'career-guidance',
    title: 'Career Guidance Session — Webinar Participation',
    issuer: 'GradGuru Innovations',
    date: 'January 2026',
    confirmed: true,
  },
]
