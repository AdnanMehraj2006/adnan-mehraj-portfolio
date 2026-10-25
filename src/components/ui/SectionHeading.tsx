import { Reveal } from './Reveal'

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
}

export function SectionHeading({ label, title, description }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <Reveal>
        <span className="section-heading__label">
          <span className="section-heading__dash" aria-hidden="true" />
          <span className="mono">{label}</span>
        </span>
        <h2 className="section-heading__title">{title}</h2>
        {description ? <p className="section-heading__desc">{description}</p> : null}
      </Reveal>
    </div>
  )
}
