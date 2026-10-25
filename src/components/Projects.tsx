import { useEffect } from 'react'
import { projects, githubProfileUrl } from '../data/projects'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import './Projects.css'

interface ProjectsProps {
  focusedProjects: string[]
}

const NAVBAR_OFFSET = 72
const VIEW_MARGIN = 16

export function Projects({ focusedProjects }: ProjectsProps) {
  useEffect(() => {
    if (focusedProjects.length === 0) return

    // First highlighted card in actual DOM order.
    const cards = Array.from(
      document.querySelectorAll('.project-card.is-focused'),
    ) as HTMLElement[]
    if (cards.length === 0) return

    const first = cards[0]
    const last = cards[cards.length - 1]
    const viewportH = window.innerHeight
    const firstRect = first.getBoundingClientRect()
    const lastRect = last.getBoundingClientRect()

    // If the first highlighted card is already fully visible, do nothing
    // (avoids unnecessary scroll/jitter).
    if (firstRect.top >= NAVBAR_OFFSET && firstRect.bottom <= viewportH - VIEW_MARGIN) return

    // Priority 1: the FIRST highlighted card must be visible, pinned under the
    // navbar. Priority 2: reveal as many further highlighted cards as fit.
    let targetY = window.scrollY + firstRect.top - (NAVBAR_OFFSET + 12)

    if (cards.length > 1) {
      const overflowBottom = lastRect.bottom - (viewportH - VIEW_MARGIN)
      // Only lift to reveal more highlights; never so far that the first
      // highlighted card scrolls out of view.
      const maxReveal = NAVBAR_OFFSET + 4
      targetY += Math.min(Math.max(0, overflowBottom), maxReveal)
    }

    targetY = Math.max(0, targetY)
    targetY = Math.min(targetY, document.documentElement.scrollHeight - window.innerHeight)

    // Positional form: reliable in every environment, never an animated
    // smooth-scroll that can be cancelled, fought, or overshoot.
    window.scrollTo(0, targetY)
  }, [focusedProjects])

  const featured = projects.filter((project) => project.featured)
  const rest = projects.filter((project) => !project.featured)

  const renderCard = (project: (typeof projects)[number]) => (
    <Reveal key={project.id}>
      <ProjectCard project={project} focused={focusedProjects.includes(project.id)} />
    </Reveal>
  )

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <SectionHeading
          label="02 / Selected Work"
          title="Problems first. Projects second. Details always."
          description="A selection of tools and experiments built around practical problems, useful functionality, and learning through implementation."
        />

        <div className="projects__grid projects__grid--featured">
          {featured.map(renderCard)}
        </div>

        <div className="projects__grid">{rest.map(renderCard)}</div>

        <div className="projects__more">
          <Reveal>
            <Button href={githubProfileUrl} external variant="ghost">
              View All Projects on GitHub
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
