import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { skillGroups, type Skill } from '../data/skills'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import './Skills.css'

interface SkillsProps {
  onFocusProjects: (projectIds: string[]) => void
}

const STATUS_LABEL: Record<Skill['status'], string> = {
  demonstrated: 'demonstrated in projects',
  learning: 'learning',
  exploring: 'exploring',
}

export function Skills({ onFocusProjects }: SkillsProps) {
  const [selected, setSelected] = useState<string | null>(null)

  function toggleSkill(skill: Skill) {
    if (selected === skill.name) {
      setSelected(null)
      onFocusProjects([])
      return
    }
    setSelected(skill.name)
    onFocusProjects(skill.relatedProjects)
  }

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading
          label="Skills"
          title="The toolkit behind the work."
          description="Technologies demonstrated in real projects, plus areas I'm actively learning and exploring. Status is shown honestly — no inflated proficiency claims."
        />

        <div className="skills__legend mono">
          <span className="skills__legend-item">
            <span className="skills__dot skills__dot--solid" /> demonstrated in projects
          </span>
          <span className="skills__legend-item">
            <span className="skills__dot skills__dot--learning" /> currently learning
          </span>
          <span className="skills__legend-item">
            <span className="skills__dot skills__dot--exploring" /> exploring
          </span>
        </div>

        <div className="skills__groups">
          {skillGroups.map((group, index) => (
            <Reveal key={group.id} delay={index * 0.05} className="skills__group">
              <h3 className="skills__group-title">{group.title}</h3>
              <div className="skills__chips">
                {group.skills.map((skill) => {
                  const active = selected === skill.name
                  return (
                    <button
                      key={skill.name}
                      type="button"
                      className={`skill-chip skill-chip--${skill.status} ${active ? 'is-active' : ''}`}
                      onClick={() => toggleSkill(skill)}
                      aria-pressed={active}
                      title={STATUS_LABEL[skill.status]}
                    >
                      <span className={`skill-chip__dot skill-chip__dot--${skill.status}`} aria-hidden="true" />
                      <span className="skill-chip__name">{skill.name}</span>
                    </button>
                  )
                })}
              </div>
            </Reveal>
          ))}
        </div>

        {selected ? (
          <div className="skills__focused">
            <span className="mono skills__focused-label">
              {selected} → highlighting related projects
            </span>
            <button
              type="button"
              className="skills__clear mono"
              onClick={() => {
                setSelected(null)
                onFocusProjects([])
              }}
            >
              <RotateCcw size={14} aria-hidden="true" /> clear
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
