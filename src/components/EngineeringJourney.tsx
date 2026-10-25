import { learningAreas, terminalLines } from '../data/learning'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import './EngineeringJourney.css'

export function EngineeringJourney() {
  return (
    <section id="journey" className="section">
      <div className="container">
        <SectionHeading
          label="Currently Exploring"
          title="The engineering journey."
          description="Honest focus areas I'm actively developing — learning areas, not claims of expertise."
        />

        <div className="ej__layout">
          <div className="ej__areas">
            {learningAreas.map((area, index) => (
              <Reveal key={area.id} delay={index * 0.05} className="ej__cell">
                <div className="ej__area">
                  <span className="ej__index mono">0{index + 1}</span>
                  <div>
                    <h3 className="ej__area-title">{area.label}</h3>
                    <p className="ej__area-detail">{area.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="ej__terminal">
              <div className="ej__terminal-bar">
                <span className="ej__terminal-dots">
                  <i /><i /><i />
                </span>
                <span className="ej__terminal-title mono">~ / journey</span>
              </div>
              <div className="ej__terminal-body">
                {terminalLines.map((line, index) => (
                  <div key={index} className="ej__line">
                    <span className="ej__prompt mono">$</span>
                    <span className="ej__cmd mono">{line.text}</span>
                    <span className="ej__out mono">{line.output}</span>
                  </div>
                ))}
                <div className="ej__cursor-wrap">
                  <span className="ej__prompt mono">$</span>
                  <span className="ej__cursor" aria-hidden="true" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
