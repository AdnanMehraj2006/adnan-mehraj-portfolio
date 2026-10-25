export interface Certification {
  id: string
  title: string
  issuer: string
  date?: string
  /** Credential / certificate ID, when supplied. */
  credentialId?: string
  /** Skills demonstrated, when supplied. */
  skills?: string[]
  /** Short description, when supplied. */
  description?: string
  /** Real public verification URL, when supplied. */
  verifyUrl?: string
  /** When true, details are confirmed by the issuer/public profile. */
  confirmed: boolean
}

/**
 * Certification data. Each entry is edited from this single file.
 * Only confirmed entries are shown. A Verification button appears only when
 * a real `verifyUrl` exists; the credential ID is never used as a URL.
 */
export const certifications: Certification[] = [
  {
    id: 'synertech-hackathon',
    title: 'Synertech 2026 Hackathon – 2nd Runner-Up Certificate',
    issuer: 'Kashmir College of Engineering & Technology',
    date: 'May 2026',
    skills: ['Artificial Intelligence (AI)', 'Web Development'],
    description:
      'Awarded for securing the 2nd Runner-Up position at Synertech 2026 Hackathon hosted by Kashmir College of Engineering and Technology, Srinagar.',
    confirmed: true,
  },
  {
    id: 'icat',
    title: 'Internship Common Aptitude Test (ICAT) – Certificate of Participation',
    issuer: 'ICAT (Internship Common Aptitude Test)',
    date: 'June 2026',
    credentialId: 'CIT-P-3363803',
    skills: ['Aptitude Testing', 'Problem Solving'],
    description:
      'Participated in the Internship Common Aptitude Test (ICAT) on 1 June 2026, demonstrating aptitude, analytical thinking, and problem-solving abilities. This experience strengthened my assessment readiness and professional development.',
    confirmed: true,
  },
  {
    id: 'aic-summit',
    title: 'All India Career Summit – Certificate of Participation',
    issuer: 'Aptus Technologies',
    date: 'March 2026',
    skills: ['Career Development', 'Professional Networking'],
    description:
      'Participated in the All India Career Summit organized by Aptus Technologies on 1 March 2026. The event provided insights into career opportunities, industry trends, and professional development in the technology sector.',
    confirmed: true,
  },
  {
    id: 'java-greatlearning',
    title: 'Java Programming in Hindi – Certificate of Completion',
    issuer: 'Great Learning',
    date: 'May 2022',
    skills: ['Java Fundamentals', 'Core Java'],
    verifyUrl: 'https://www.mygreatlearning.com/certificate/QYAKIMPD',
    description:
      'Completed a Java Programming course from Great Learning Academy. Covered core Java fundamentals including variables, data types, operators, arrays, and collections. Strengthened programming basics and logical thinking for software development.',
    confirmed: true,
  },
  {
    id: 'career-guidance',
    title: 'Career Guidance Session – Certificate of Participation',
    issuer: 'GradGuru Innovations',
    date: 'January 2026',
    skills: ['Career Planning', 'Professional Development'],
    description:
      'Participated in a Career Guidance Session organized by Grad Guru Innovation, an ISO-certified organization, on 24 January 2026.',
    confirmed: true,
  },
  {
    id: 'synertech2025-participation',
    title: 'Synertech-2025 – Certificate of Participation',
    issuer: 'Kashmir College of Engineering & Technology',
    description:
      'Participated in Synertech-2025 held at KCET Srinagar, gaining exposure to technology trends, exploring innovative ideas, and collaborating with fellow tech enthusiasts. This participation enhanced my knowledge and motivated me to keep learning.',
    confirmed: true,
  },
  {
    id: 'synertech2025-coordinator',
    title: 'Synertech-2025 – Certificate of Appreciation (Student Coordinator)',
    issuer: 'Kashmir College of Engineering & Technology',
    description:
      'Received a Certificate of Appreciation for my role as Student Coordinator during Synertech-2025, recognizing dedication, teamwork, and contributions to the event. Collaborated with peers, managed responsibilities, and helped create a platform for innovation.',
    confirmed: true,
  },
  {
    id: 'ide-bootcamp',
    title: 'Innovation, Design & Entrepreneurship (IDE) Bootcamp – Volunteer Certificate',
    issuer: 'All India Council for Technical Education (AICTE)',
    date: 'November 2024',
    description:
      'Volunteered at the Innovation, Design & Entrepreneurship Bootcamp for PM SHRI Schools in November 2024, supporting training for educators at KCET Narbal under the Ministry of Education\u2019s Innovation Cell.',
    confirmed: true,
  },
  {
    id: 'cybersecurity-tmf',
    title: 'Cybersecurity – Certificate of Participation (Tech Mahindra Foundation)',
    issuer: 'Tech Mahindra Foundation',
    date: 'November 2024',
    skills: ['Cybersecurity'],
    verifyUrl:
      'https://courses.skillindiadigital.gov.in/api/custom_api/view_certificate/bed492930106468bac8c724214744dc7',
    description:
      'Completed a 10-hour Cybersecurity skilling course by Tech Mahindra Foundation via Skill India Digital Hub in November 2024. Gained foundational knowledge in cyber safety and digital security.',
    confirmed: true,
  },
  {
    id: 'digital-marketing',
    title: 'Fundamentals of Digital Marketing – Google Digital Unlocked Certificate',
    issuer: 'Google',
    date: 'November 2020',
    skills: ['Fundamentals of Digital Marketing'],
    description:
      'Certified in Fundamentals of Digital Marketing by Google, endorsed by The Open University and IAB Europe. Learned about SEO, SEM, and digital strategy.',
    confirmed: true,
  },
]
