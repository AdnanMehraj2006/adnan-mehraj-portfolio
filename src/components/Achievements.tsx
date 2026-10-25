import { BadgeCheck } from 'lucide-react'
import { certifications } from '../data/certifications'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import './Achievements.css'

export function Achievements() {
  return (
    <section id="achievements" className="section">
      <div className="container">
        <SectionHeading
          label="04 / Proof of Progress"
          title="Learning is good. Evidence is better."
          description="Credentials and participation verified from public profiles and issuing organizations."
        />

        <div className="ach__grid">
          {certifications.map((entry, index) => (
            <Reveal key={entry.id} delay={index * 0.06} className="ach__cell">
              <article className="ach__card">
                <div className="ach__head">
                  <BadgeCheck size={20} className="ach__check" aria-hidden="true" />
                  <span className="ach__issuer">{entry.issuer}</span>
                </div>
                <h3 className="ach__title">{entry.title}</h3>
                {entry.date ? <span className="ach__date mono">{entry.date}</span> : null}
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="ach__foot">
            <span className="ach__foot-mark mono">&</span>
            <p className="ach__foot-text">
              More achievements are verified as they are confirmed from original sources.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
