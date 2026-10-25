import { Code2, GraduationCap, ExternalLink } from 'lucide-react'
import type { ComponentType } from 'react'
import { GithubIcon, LinkedinIcon } from './ui/BrandIcons'
import { profiles } from '../data/profiles'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import './Contact.css'

type IconComponent = ComponentType<{ size?: number; className?: string }>

const PROFILE_ICONS: Record<string, IconComponent> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  leetcode: Code2,
  geeksforgeeks: GraduationCap,
}

export function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionHeading
          label="05 / Initiate Connection"
          title="Have an idea worth building?"
          description="I'm interested in connecting with developers, learning from people who build great software, and exploring opportunities to contribute to meaningful projects."
        />

        <Reveal>
          <div className="contact__panel">
            <div className="contact__links">
              {profiles.map((profile) => {
                const Icon = PROFILE_ICONS[profile.id] ?? GithubIcon
                return (
                  <a
                    key={profile.id}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact__link"
                  >
                    <span className="contact__link-icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="contact__link-text">
                      <span className="contact__link-label">{profile.label}</span>
                      <span className="contact__link-handle mono">{profile.handle}</span>
                    </span>
                    <ExternalLink size={15} className="contact__link-ext" aria-hidden="true" />
                  </a>
                )
              })}
            </div>

            <div className="contact__orb" aria-hidden="true">
              <span className="contact__orb-core" />
              <span className="contact__orb-ring" />
              <span className="contact__orb-ring contact__orb-ring--2" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
