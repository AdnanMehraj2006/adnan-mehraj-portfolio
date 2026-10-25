import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { projects, githubProfileUrl } from '../data/projects'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import './Projects.css'

interface ProjectsProps {
  focusedProjects: string[]
}

export function Projects({ focusedProjects }: ProjectsProps) {
  const firstFocusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (focusedProjects.length > 0 && firstFocusRef.current) {
      firstFocusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
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

        <div className="projects__grid projects__grid--featured" ref={firstFocusRef}>
          {featured.map(renderCard)}
        </div>

        <div className="projects__grid">{rest.map(renderCard)}</div>

        <div className="projects__more">
          <Reveal>
            <Button href={githubProfileUrl} external variant="ghost">
              View All Projects on GitHub
              <ArrowUpRight size={17} />
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
