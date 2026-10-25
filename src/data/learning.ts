export interface LearningArea {
  id: string
  label: string
  detail: string
}

export const learningAreas: LearningArea[] = [
  {
    id: 'dsa',
    label: 'Strengthening DSA',
    detail: 'Practicing data structures and algorithms to improve logical thinking and write better solutions.',
  },
  {
    id: 'backend',
    label: 'Exploring Backend Development',
    detail: 'Learning backend fundamentals and Spring Boot to go beyond the front end.',
  },
  {
    id: 'tools',
    label: 'Building Practical Software',
    detail: 'Turning ideas into usable desktop and web tools, iterating through feedback.',
  },
  {
    id: 'debugging',
    label: 'Learning Through Iteration',
    detail: 'Debugging, testing, and refining — the loop that makes software real.',
  },
  {
    id: 'security',
    label: 'Exploring Cybersecurity',
    detail: 'Studying how systems behave and how to build more secure, robust software.',
  },
]

export const terminalLines = [
  { prompt: true, text: 'whoami', output: 'Computer Engineering student' },
  { prompt: true, text: 'current-focus', output: 'Software development · DSA · Backend fundamentals' },
  { prompt: true, text: 'philosophy', output: 'Build. Test. Learn. Repeat.' },
] as const
