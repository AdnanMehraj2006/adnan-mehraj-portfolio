import type { ReactNode, MouseEvent } from 'react'

export type ButtonVariant = 'primary' | 'ghost' | 'nav'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  href?: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  className?: string
  'aria-label'?: string
  external?: boolean
}

export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  external,
  ...rest
}: ButtonProps) {
  const classes = `btn btn--${variant} ${className}`.trim()

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
