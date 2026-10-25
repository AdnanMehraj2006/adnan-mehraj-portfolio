import { BadgeCheck, ExternalLink } from 'lucide-react'
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
            <Reveal key={entry.id} delay={index * 0.04} className="ach__cell">
              <article className="ach__card">
                <div className="ach__head">
                  <BadgeCheck size={20} className="ach__check" aria-hidden="true" />
                  <span className="ach__issuer">{entry.issuer}</span>
                </div>

                <h3 className="ach__title">{entry.title}</h3>

                {entry.date ? <span className="ach__date mono">{entry.date}</span> : null}
                {entry.credentialId ? (
                  <span className="ach__id mono">ID · {entry.credentialId}</span>
                ) : null}

                {entry.description ? <p className="ach__desc">{entry.description}</p> : null}

                {entry.skills && entry.skills.length ? (
                  <ul className="ach__skills">
                    {entry.skills.map((skill) => (
                      <li key={skill} className="ach__skill mono">
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {entry.verifyUrl ? (
                  <a
                    href={entry.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ach__verify"
                  >
                    <ExternalLink size={15} aria-hidden="true" /> Verify Certificate
                  </a>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
