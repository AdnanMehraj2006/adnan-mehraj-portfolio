import { ArrowUpRight, BookOpen } from 'lucide-react'
import { problemSolvingProfiles, dsaRepository } from '../data/profiles'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import './ProblemSolving.css'

export function ProblemSolving() {
  return (
    <section id="problem-solving" className="section">
      <div className="container">
        <SectionHeading
          label="03 / Algorithmic Thinking"
          title="Training the mind behind the code."
          description="Beyond building applications, I use coding challenges to strengthen problem-solving, understand algorithmic patterns, and develop a more systematic approach to programming."
        />

        <div className="ps__layout">
          <div className="ps__profiles">
            <Reveal>
              <div className="ps__card ps__card--leetcode">
                <div className="ps__card-top">
                  <span className="ps__badge">LC</span>
                  <span className="ps__platform mono">LeetCode</span>
                </div>
                <p className="ps__desc">
                  My LeetCode profile — a place to practice coding challenges and develop algorithmic
                  thinking.
                </p>
                <div className="ps__stats">
                  <span className="ps__bar ps__bar--1" />
                  <span className="ps__bar ps__bar--2" />
                  <span className="ps__bar ps__bar--3" />
                  <span className="ps__bar ps__bar--2" />
                  <span className="ps__bar ps__bar--4" />
                  <span className="ps__bar ps__bar--3" />
                  <span className="ps__bar ps__bar--5" />
                  <span className="ps__bar ps__bar--2" />
                  <span className="ps__bar ps__bar--4" />
                  <span className="ps__bar ps__bar--3" />
                  <span className="ps__bar ps__bar--1" />
                  <span className="ps__bar ps__bar--4" />
                  <span className="ps__bar ps__bar--2" />
                  <span className="ps__bar ps__bar--5" />
                </div>
                <a
                  href={problemSolvingProfiles[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ps__link"
                >
                  Open profile <ArrowUpRight size={15} />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="ps__card ps__card--gfg">
                <div className="ps__card-top">
                  <span className="ps__badge ps__badge--gfg">GFG</span>
                  <span className="ps__platform mono">GeeksforGeeks</span>
                </div>
                <p className="ps__desc">
                  My GeeksforGeeks profile — additional practice in programming, data structures, and
                  algorithms.
                </p>
                <a
                  href={problemSolvingProfiles[1].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ps__link"
                >
                  Open profile <ArrowUpRight size={15} />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="ps__side">
            <div className="ps__repo">
              <div className="ps__repo-head">
                <BookOpen size={18} />
                <span className="mono">DSA Practice Repository</span>
              </div>
              <p className="ps__repo-desc">
                A documented collection of coding-practice solutions across data structures and
                algorithms.
              </p>
              <a
                href={dsaRepository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ps__link"
              >
                View repository <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="ps__note">
              <span className="ps__note-label mono">note</span>
              <p className="ps__note-text">
                Live solved-count statistics are not fabricated. Profiles and repositories show the
                actual work.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
