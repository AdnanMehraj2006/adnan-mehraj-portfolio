export interface ProfileLink {
  id: string
  label: string
  url: string
  handle: string
}

export const profiles: ProfileLink[] = [
  {
    id: 'email',
    label: 'Email',
    url: 'mailto:adnanmehraj@kcet.edu.in',
    handle: 'adnanmehraj@kcet.edu.in',
  },
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/AdnanMehraj2006',
    handle: '@AdnanMehraj2006',
  },
  {
    id: 'leetcode',
    label: 'LeetCode',
    url: 'https://leetcode.com/u/Adnan_Mehraj_2006/',
    handle: 'Adnan_Mehraj_2006',
  },
  {
    id: 'geeksforgeeks',
    label: 'GeeksforGeeks',
    url: 'https://www.geeksforgeeks.org/profile/adnanmehraj2006',
    handle: 'adnanmehraj2006',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/adnan-mehraj-611904344/',
    handle: 'in/adnan-mehraj',
  },
  {
    id: 'x',
    label: 'X',
    url: 'https://x.com/AdnanMehraj2006',
    handle: '@AdnanMehraj2006',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/adn4nmehraj',
    handle: '@adn4nmehraj',
  },
  {
    id: 'snapchat',
    label: 'Snapchat',
    url: 'https://snapchat.com/add/adn4n.mehraj',
    handle: '@adn4n.mehraj',
  },
]

/** Profiles used specifically in the problem-solving section. */
export const problemSolvingProfiles: ProfileLink[] = [
  {
    id: 'leetcode',
    label: 'LeetCode',
    url: 'https://leetcode.com/u/Adnan_Mehraj_2006/',
    handle: 'Adnan_Mehraj_2006',
  },
  {
    id: 'geeksforgeeks',
    label: 'GeeksforGeeks',
    url: 'https://www.geeksforgeeks.org/profile/adnanmehraj2006',
    handle: 'adnanmehraj2006',
  },
]

export const dsaRepository = {
  label: 'DSA Practice Repository',
  url: 'https://github.com/AdnanMehraj2006/DSA',
}
