import { ExternalLink, Mail } from 'lucide-react'
import type { ComponentType } from 'react'
import {
  GFGIcon,
  GithubIcon,
  InstagramIcon,
  LeetCodeIcon,
  LinkedinIcon,
  SnapchatIcon,
  XIcon,
} from './ui/BrandIcons'
import { profiles } from '../data/profiles'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import './Contact.css'

type IconComponent = ComponentType<{ size?: number; className?: string }>

const PROFILE_ICONS: Record<string, IconComponent> = {
  email: Mail,
  github: GithubIcon,
  linkedin: LinkedinIcon,
  leetcode: LeetCodeIcon,
  geeksforgeeks: GFGIcon,
  x: XIcon,
  instagram: InstagramIcon,
  snapchat: SnapchatIcon,
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
                const isEmail = profile.id === 'email'
                return (
                  <a
                    key={profile.id}
                    href={profile.url}
                    {...(isEmail
                      ? {}
                      : { target: '_blank', rel: 'noopener noreferrer' })}
                    className={`contact__link ${isEmail ? 'contact__link--email' : ''}`}
                  >
                    <span className="contact__link-icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="contact__link-text">
                      <span className="contact__link-label">{profile.label}</span>
                      <span className="contact__link-handle mono">{profile.handle}</span>
                    </span>
                    {isEmail ? (
                      <span className="contact__link-ext contact__link-mail" aria-hidden="true">
                        <Mail size={15} />
                      </span>
                    ) : (
                      <ExternalLink size={15} className="contact__link-ext" aria-hidden="true" />
                    )}
                  </a>
                )
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
