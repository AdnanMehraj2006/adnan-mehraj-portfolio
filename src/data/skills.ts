/** Skill status: demonstrated in projects, or currently learning/exploring. */
export type SkillStatus = 'demonstrated' | 'learning' | 'exploring'

export interface Skill {
  name: string
  status: SkillStatus
  relatedProjects: string[]
}

export interface SkillGroup {
  id: string
  title: string
  skills: Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'programming',
    title: 'Programming & Problem Solving',
    skills: [
      { name: 'Java', status: 'demonstrated', relatedProjects: ['dsa'] },
      { name: 'JavaScript', status: 'demonstrated', relatedProjects: ['lawmitra', 'streamverse', 'cardshield', '1clickos'] },
      { name: 'Data Structures & Algorithms', status: 'learning', relatedProjects: ['dsa'] },
    ],
  },
  {
    id: 'web',
    title: 'Web Development',
    skills: [
      { name: 'HTML', status: 'demonstrated', relatedProjects: ['lawmitra', 'streamverse', 'cardshield', '1clickos'] },
      { name: 'CSS', status: 'demonstrated', relatedProjects: ['lawmitra', 'streamverse', 'cardshield', '1clickos'] },
      { name: 'Responsive UI Development', status: 'demonstrated', relatedProjects: ['lawmitra', 'streamverse', 'cardshield', '1clickos'] },
    ],
  },
  {
    id: 'desktop',
    title: 'Desktop Development',
    skills: [
      { name: 'C#', status: 'demonstrated', relatedProjects: ['clipmind'] },
      { name: 'WPF', status: 'demonstrated', relatedProjects: ['clipmind'] },
      { name: '.NET', status: 'demonstrated', relatedProjects: ['clipmind'] },
    ],
  },
  {
    id: 'data',
    title: 'Data & Persistence',
    skills: [
      { name: 'SQLite', status: 'demonstrated', relatedProjects: ['clipmind'] },
      { name: 'Browser Storage', status: 'demonstrated', relatedProjects: ['lawmitra', 'cardshield'] },
      { name: 'JDBC', status: 'learning', relatedProjects: [] },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Workflow',
    skills: [
      {
        name: 'Git',
        status: 'demonstrated',
        relatedProjects: ['clipmind', 'lawmitra', 'streamverse', 'cardshield', '1clickos', 'dsa'],
      },
      {
        name: 'GitHub',
        status: 'demonstrated',
        relatedProjects: ['clipmind', 'lawmitra', 'streamverse', 'cardshield', '1clickos', 'dsa'],
      },
      {
        name: 'Browser Developer Tools',
        status: 'demonstrated',
        relatedProjects: ['lawmitra', 'streamverse', 'cardshield', '1clickos'],
      },
      {
        name: 'Debugging & Testing',
        status: 'demonstrated',
        relatedProjects: ['clipmind', 'lawmitra', 'streamverse', 'cardshield'],
      },
    ],
  },
  {
    id: 'interests',
    title: 'Areas of Interest',
    skills: [
      { name: 'Backend Development', status: 'exploring', relatedProjects: [] },
      { name: 'Spring Boot', status: 'exploring', relatedProjects: [] },
      { name: 'Cybersecurity', status: 'exploring', relatedProjects: ['cardshield'] },
      { name: 'Software Engineering', status: 'exploring', relatedProjects: [] },
    ],
  },
]
