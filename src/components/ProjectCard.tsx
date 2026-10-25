import { useRef, useState, type MouseEvent } from 'react'
import { ExternalLink, ChevronDown, Sparkles, Download } from 'lucide-react'
import { GithubIcon } from './ui/BrandIcons'
import type { Project } from '../data/projects'
import { ProjectPreview } from './ProjectPreviews'
import './ProjectCard.css'

interface ProjectCardProps {
  project: Project
  focused: boolean
}

export function ProjectCard({ project, focused }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLElement>(null)

  function onMove(event: MouseEvent<HTMLElement>) {
    const el = cardRef.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -6, y: px * 8 })
  }

  function onLeave() {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <article
      ref={cardRef}
      className={`project-card ${focused ? 'is-focused' : ''} ${expanded ? 'is-expanded' : ''}`}
      style={{ transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="project-card__preview">
        <ProjectPreview kind={project.preview} />
        <span className="project-card__preview-tag mono">concept</span>
        {project.featured ? (
          <span className="project-card__featured mono">
            <Sparkles size={12} /> featured
          </span>
        ) : null}
      </div>

      <div className="project-card__body">
        <div className="project-card__top">
          <span className="project-card__category mono">{project.category}</span>
          {project.release ? (
            <span className="project-card__release-badge mono">
              RELEASED · {project.release.version}
            </span>
          ) : null}
        </div>
        <h3 className="project-card__name">{project.name}</h3>
        <p className="project-card__tagline">{project.tagline}</p>
        <p className="project-card__desc">{project.description}</p>

        <ul className="project-card__stack">
          {project.stack.map((tech) => (
            <li key={tech} className="project-card__tech mono">
              {tech}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="project-card__toggle mono"
          aria-expanded={expanded}
          aria-controls={`highlights-${project.id}`}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Hide highlights' : 'Highlights'}
          <ChevronDown size={15} className={expanded ? 'rotate' : ''} />
        </button>

        {expanded ? (
          <ul id={`highlights-${project.id}`} className="project-card__highlights">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="project-card__highlight">
                <span className="project-card__highlight-mark">▸</span>
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="project-card__actions">
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card__action"
          >
            <GithubIcon size={16} /> Source
          </a>
          {project.release ? (
            <a
              href={project.release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__action project-card__action--release"
            >
              <Download size={16} /> Download {project.release.version}
            </a>
          ) : null}
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__action project-card__action--demo"
            >
              <ExternalLink size={16} /> Live Demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
