import { Hammer, Puzzle, Compass } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import './About.css'

const FOCUS = [
  {
    id: 'build',
    icon: Hammer,
    title: 'BUILD',
    description:
      'I like turning practical problems into usable software, from desktop utilities to browser-based applications.',
  },
  {
    id: 'solve',
    icon: Puzzle,
    title: 'SOLVE',
    description:
      'I practice Data Structures and Algorithms to improve logical thinking, recognize patterns, and write better solutions.',
  },
  {
    id: 'explore',
    icon: Compass,
    title: 'EXPLORE',
    description:
      'I enjoy experimenting with new technologies, understanding system behavior, and learning through implementation.',
  },
] as const

export function About() {
  return (
    <section id="about" className="section tech-grid">
      <div className="container">
        <SectionHeading
          label="01 / Behind The Code"
          title="Not just learning technology. Building with it."
          description="I'm a Computer Engineering student interested in the engineering behind useful software. My approach is hands-on: explore an idea, understand the problem, build a solution, test its limitations, and improve it. My projects span Windows desktop utilities, browser-based tools, and practical web applications. Alongside building, I continue to develop my problem-solving skills and strengthen my software engineering foundations."
        />

        <div className="about__focus">
          {FOCUS.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.08} className="about__focus-cell">
              <article className="about__card">
                <div className="about__card-icon">
                  <item.icon size={22} aria-hidden="true" />
                </div>
                <h3 className="about__card-title mono">{item.title}</h3>
                <p className="about__card-desc">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="about__philosophy">
            <span className="about__philosophy-mark mono">&gt;</span>
            <p className="about__philosophy-text mono">
              Understand the problem. Build the solution. Improve the details.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
